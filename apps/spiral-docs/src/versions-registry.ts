import docsManifest from "./versions/manifest.json";

export type ComponentDocPointer =
  | { rev: string; inherits?: undefined }
  | { inherits: string; rev?: undefined };

export type DocsVersionEntry = {
  spiral: string;
  tokens: string;
  icons: string;
  status: "ready" | "draft";
  components: Record<string, ComponentDocPointer>;
};

export type DocsManifest = {
  covered: string[];
  default: string;
  versions: Record<string, DocsVersionEntry>;
};

const manifest = docsManifest as DocsManifest;

export function getDocsManifest(): DocsManifest {
  return manifest;
}

export function getDefaultDocsVersion(): string {
  return manifest.default;
}

export function getCoveredDocsVersions(): string[] {
  return [...manifest.covered].sort((a, b) => compareSemverDesc(a, b));
}

export function getDocsVersionEntry(version: string): DocsVersionEntry | undefined {
  return manifest.versions[version];
}

/** Resolve the content revision id for a component at a docs version. */
export function resolveComponentRevision(
  docsVersion: string,
  component: string,
  seen = new Set<string>(),
): string | undefined {
  if (seen.has(docsVersion)) return undefined;
  seen.add(docsVersion);

  const entry = manifest.versions[docsVersion];
  const pointer = entry?.components[component];
  if (pointer?.rev) return pointer.rev;
  if (pointer?.inherits) {
    // Prefer walking another docs-version entry; if that version is absent,
    // treat `inherits` as a direct content-revision id (common for baselines).
    if (manifest.versions[pointer.inherits]) {
      return resolveComponentRevision(pointer.inherits, component, seen);
    }
    return pointer.inherits;
  }

  // No pointer at this docs version → fall back to the previous covered version.
  const coveredAsc = [...manifest.covered].sort((a, b) => -compareSemverDesc(a, b));
  const idx = coveredAsc.indexOf(docsVersion);
  if (idx > 0) {
    return resolveComponentRevision(coveredAsc[idx - 1], component, seen);
  }
  return undefined;
}

function compareSemverDesc(a: string, b: string): number {
  const pa = a.split(".").map((n) => Number.parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => Number.parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const d = (pb[i] ?? 0) - (pa[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

export function isSemverGreater(a: string, b: string): boolean {
  return compareSemverDesc(a, b) < 0;
}
