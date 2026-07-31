import registry from "./generated/component-changelogs.json";
import { flattenNavItems } from "./nav";

export type ChangelogSections = Record<string, string[]>;

export type ComponentChangelogRelease = {
  version: string;
  sections: ChangelogSections;
};

export type ComponentChangelogs = Record<string, ComponentChangelogRelease[]>;

export type AggregatedChange = {
  component: string;
  path?: string;
  sections: ChangelogSections;
};

export type AggregatedRelease = {
  version: string;
  changes: AggregatedChange[];
};

const SECTION_ORDER = ["Added", "Changed", "Fixed", "Deprecated", "Removed"] as const;

function compareSemverDesc(a: string, b: string): number {
  if (a === "Unreleased") return -1;
  if (b === "Unreleased") return 1;
  const pa = a.split(".").map((n) => Number.parseInt(n, 10) || 0);
  const pb = b.split(".").map((n) => Number.parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const d = (pb[i] ?? 0) - (pa[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

function componentDocPath(name: string): string | undefined {
  return flattenNavItems().find((item) => item.component === name)?.path;
}

export function getComponentChangelogs(): ComponentChangelogs {
  return registry as unknown as ComponentChangelogs;
}

export function getComponentChangelog(
  name: string,
): ComponentChangelogRelease[] | undefined {
  const releases = (registry as unknown as ComponentChangelogs)[name];
  return releases && releases.length > 0 ? releases : undefined;
}

/** Flatten all component entries into version → components (newest first). */
export function getAggregatedReleases(): AggregatedRelease[] {
  const byVersion = new Map<string, AggregatedChange[]>();

  for (const [component, releases] of Object.entries(
    registry as unknown as ComponentChangelogs,
  )) {
    for (const release of releases) {
      if (release.version === "Unreleased") continue;
      const list = byVersion.get(release.version) ?? [];
      list.push({
        component,
        path: componentDocPath(component),
        sections: release.sections,
      });
      byVersion.set(release.version, list);
    }
  }

  return [...byVersion.entries()]
    .sort(([a], [b]) => compareSemverDesc(a, b))
    .map(([version, changes]) => ({
      version,
      changes: changes.sort((a, b) => a.component.localeCompare(b.component)),
    }));
}

export function orderedSectionKeys(sections: ChangelogSections): string[] {
  const keys = Object.keys(sections).filter((key) => (sections[key]?.length ?? 0) > 0);
  return keys.sort((a, b) => {
    const ia = SECTION_ORDER.indexOf(a as (typeof SECTION_ORDER)[number]);
    const ib = SECTION_ORDER.indexOf(b as (typeof SECTION_ORDER)[number]);
    if (ia === -1 && ib === -1) return a.localeCompare(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}
