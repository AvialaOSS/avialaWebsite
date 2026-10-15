import registry from "./generated/component-changelogs.json";
import npmReleases from "./generated/npm-releases.json";
import { flattenNavItems } from "./nav";
import { isSemverGreater } from "./versions-registry";

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
  publishedAt?: string;
  changes: AggregatedChange[];
};

export const SPIRAL_PACKAGE_NAME = "@aviala-design/spiral";

const SECTION_ORDER = ["Added", "Changed", "Fixed", "Deprecated", "Removed"] as const;

// Package-only releases have no component changelog entries to aggregate.
const PACKAGE_RELEASE_CHANGES: Record<string, AggregatedChange[]> = {
  "3.1.1": [
    {
      component: "Icons 图标",
      path: "/components/system-composition/icons",
      sections: {
        Added: [
          "Icons 2.6.0 新增 Android、Discord、Google、Shazam、压缩文件夹、退出全屏、定位关闭、多窗口、航班到达及航班出发，共 10 个图标。",
        ],
        Changed: [
          "同步 Figma 图标库，更新已有图标的形状并补充字重与填充变体，图标库现包含 364 个图标、2034 个变体。",
          "Spiral 升级图标依赖至 @aviala-design/icons 2.6.0；组件 API 保持不变，Tokens 继续使用 2.7.0。",
        ],
      },
    },
  ],
};

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

export function getSpiralRepositoryUrl(): string {
  return npmReleases.repositoryUrl || "https://github.com/AvialaOSS/developer-kit";
}

export type SpiralPackageManager = "npm" | "yarn" | "pnpm";

export function getSpiralGithubReleaseUrl(version: string): string {
  const tag = `${SPIRAL_PACKAGE_NAME}@${version}`;
  return `${getSpiralRepositoryUrl()}/releases/tag/${encodeURIComponent(tag)}`;
}

export function getSpiralInstallCommand(
  version: string,
  manager: SpiralPackageManager = "npm",
): string {
  const pkg = `${SPIRAL_PACKAGE_NAME}@${version}`;
  if (manager === "yarn") return `yarn add ${pkg}`;
  if (manager === "pnpm") return `pnpm add ${pkg}`;
  return `npm install ${pkg}`;
}

export function getReleasePublishedAt(version: string): string | undefined {
  const versions = npmReleases.versions as Record<string, { publishedAt?: string } | undefined>;
  return versions[version]?.publishedAt;
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

/** Combine component and package changes available at the selected docs version. */
export function getAggregatedReleases(docsVersion: string): AggregatedRelease[] {
  const byVersion = new Map<string, AggregatedChange[]>();

  for (const [component, releases] of Object.entries(
    registry as unknown as ComponentChangelogs,
  )) {
    for (const release of releases) {
      const list = byVersion.get(release.version) ?? [];
      list.push({
        component,
        path: componentDocPath(component),
        sections: release.sections,
      });
      byVersion.set(release.version, list);
    }
  }

  for (const [version, changes] of Object.entries(PACKAGE_RELEASE_CHANGES)) {
    if (isSemverGreater(version, docsVersion)) continue;
    byVersion.set(version, [...(byVersion.get(version) ?? []), ...changes]);
  }

  return [...byVersion.entries()]
    .sort(([a], [b]) => compareSemverDesc(a, b))
    .map(([version, changes]) => ({
      version,
      publishedAt: getReleasePublishedAt(version),
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
