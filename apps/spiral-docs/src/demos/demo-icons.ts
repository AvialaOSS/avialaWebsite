import { GeneralCollapseSidebar, GeneralSearch, GeneralSetting, SymbolInformationCircle, UsersUserCircle, DirectionArrowLeft } from "@aviala-design/icons";
import type { IconCatalogEntry } from "@aviala-design/icons";

/** Fallback icons available before the full catalog lazy-loads (and for demos that hardcode icons without icon knobs). */
const FALLBACK_ICON_COMPONENTS = {
  GeneralSetting,
  GeneralSearch,
  GeneralCollapseSidebar,
  SymbolInformationCircle,
  UsersUserCircle,
  DirectionArrowLeft,
} as const;

export const DEFAULT_ICON_NAME = "GeneralSetting";

let catalogEntries: readonly IconCatalogEntry[] | null = null;
const componentByName = new Map<string, IconCatalogEntry["component"]>(
  Object.entries(FALLBACK_ICON_COMPONENTS).map(([name, component]) => [name, component])
);

export async function loadIconCatalog(): Promise<readonly IconCatalogEntry[]> {
  if (catalogEntries) return catalogEntries;

  const { iconCatalog } = await import("@aviala-design/icons");
  catalogEntries = iconCatalog;
  for (const entry of iconCatalog) {
    componentByName.set(entry.name, entry.component);
  }
  return catalogEntries;
}

export function isIconCatalogLoaded(): boolean {
  return catalogEntries !== null;
}

export function getIconCatalogEntries(): readonly IconCatalogEntry[] {
  return catalogEntries ?? [];
}

export function resolveIconComponent(name: string): IconCatalogEntry["component"] | undefined {
  return componentByName.get(name) ?? componentByName.get(DEFAULT_ICON_NAME);
}

export function resolveIconName(name: string): string {
  if (componentByName.has(name)) return name;
  if (catalogEntries?.some((entry) => entry.name === name)) return name;
  return DEFAULT_ICON_NAME;
}

/** JSX tags in live code that match known icon component names (fallback + loaded catalog). */
export function collectIconNamesFromCode(code: string): string[] {
  const names: string[] = [];
  for (const match of code.matchAll(/<\s*([A-Z][A-Za-z0-9]*)\b/g)) {
    const name = match[1]!;
    if (componentByName.has(name)) names.push(name);
  }
  return names;
}

export function buildDemoIconScope(names: readonly string[]): Record<string, unknown> {
  const scope: Record<string, unknown> = { ...FALLBACK_ICON_COMPONENTS };
  const unique = [...new Set(names.map((name) => resolveIconName(name)).filter(Boolean))];

  for (const name of unique) {
    const component = resolveIconComponent(name);
    if (component) scope[name] = component;
  }

  return scope;
}

export function jsxIconProp(
  visible: boolean,
  iconName: string,
  attr: "leftIcon" | "rightIcon"
): string {
  if (!visible) return "";
  const resolved = resolveIconName(iconName);
  return `\n    ${attr}={<${resolved} aria-hidden />}`;
}
