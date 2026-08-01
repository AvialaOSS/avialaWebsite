import { resolveComponentRevision } from "../versions-registry";
import { resolveReadingDocsVersion } from "../components/DocsVersionProvider";
import type { ComponentDocRevision } from "./types";

type RevisionModule = { default: ComponentDocRevision };

/**
 * Eager glob: `doc-revisions/{Component}/{semver}.ts`
 * Example: `Button/2.1.0.ts`
 */
const revisionModules = import.meta.glob("./*/*.ts", {
  eager: true,
}) as Record<string, RevisionModule>;

const byComponent = new Map<string, Map<string, ComponentDocRevision>>();

for (const [path, mod] of Object.entries(revisionModules)) {
  // "./Button/2.1.0.ts"
  const match = path.match(/^\.\/([^/]+)\/([^/]+)\.ts$/);
  if (!match) continue;
  const [, component, fileRev] = match;
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
