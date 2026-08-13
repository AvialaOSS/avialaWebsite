import { resolveComponentRevision } from "../versions-registry";
import { resolveReadingDocsVersion } from "../components/DocsVersionProvider";
import type { ComponentDocRevision, DesignGuideDoc } from "./types";

type RevisionModule = { default: ComponentDocRevision };
type DesignGuideModule = { default: DesignGuideDoc };

/** Files under `{Component}/` that are not semver content revisions. */
const NON_REVISION_FILES = new Set(["design-guide"]);

/**
 * Eager glob: `doc-revisions/{Component}/{semver}.ts`
 * Example: `Button/2.1.0.ts`
 */
const revisionModules = import.meta.glob("./*/*.ts", {
  eager: true,
}) as Record<string, RevisionModule>;

/** Versionless design & usage guide: `{Component}/design-guide.ts`. */
const designGuideModules = import.meta.glob("./*/design-guide.ts", {
  eager: true,
}) as Record<string, DesignGuideModule>;

const byComponent = new Map<string, Map<string, ComponentDocRevision>>();
const designGuides = new Map<string, DesignGuideDoc>();

for (const [path, mod] of Object.entries(revisionModules)) {
  // "./Button/2.1.0.ts"
  const match = path.match(/^\.\/([^/]+)\/([^/]+)\.ts$/);
  if (!match) continue;
  const [, component, fileRev] = match;
  if (NON_REVISION_FILES.has(fileRev)) continue;
  const revision = mod.default;
  if (!revision || revision.revision !== fileRev) {
    console.warn(
      `[doc-revisions] ${path}: export.revision (${revision?.revision}) should match filename (${fileRev})`,
    );
  }
  let map = byComponent.get(component);
  if (!map) {
    map = new Map();
    byComponent.set(component, map);
  }
  map.set(fileRev, revision);
}

for (const [path, mod] of Object.entries(designGuideModules)) {
  const match = path.match(/^\.\/([^/]+)\/design-guide\.ts$/);
  if (!match) continue;
  const guide = mod.default;
  if (!guide || (guide.status !== "draft" && guide.status !== "published")) {
    console.warn(`[doc-revisions] ${path}: default export is not a DesignGuideDoc`);
    continue;
  }
  designGuides.set(match[1]!, guide);
}

/** Active docs package version for this SPA build / soft-switch / URL. */
export function getActiveDocsVersion(): string {
  return resolveReadingDocsVersion();
}

export function listComponentRevisions(component: string): string[] {
  const map = byComponent.get(component);
  if (!map) return [];
  return [...map.keys()].sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));
}

export function getRevisionById(
  component: string,
  revisionId: string,
): ComponentDocRevision | undefined {
  return byComponent.get(component)?.get(revisionId);
}

/**
 * Resolve which content revision to show for a component under the active
 * (or given) docs version, following manifest `rev` / `inherits` pointers.
 */
export function getComponentDocRevision(
  component: string,
  docsVersion = getActiveDocsVersion(),
): ComponentDocRevision | undefined {
  const revisionId = resolveComponentRevision(docsVersion, component);
  if (!revisionId) return undefined;
  return getRevisionById(component, revisionId);
}

/**
 * Versionless design & usage guide for a component.
 * Prefers `{Component}/design-guide.ts`; falls back to `revision.designGuide`.
 */
export function getComponentDesignGuide(
  component: string,
  docsVersion = getActiveDocsVersion(),
): DesignGuideDoc | undefined {
  const standalone = designGuides.get(component);
  if (standalone) return standalone;
  return getComponentDocRevision(component, docsVersion)?.designGuide;
}
