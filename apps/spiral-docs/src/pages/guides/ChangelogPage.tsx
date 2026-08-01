import { Button, Select, SelectContent, SelectItem, SelectItemGroup, SelectTrigger, Typography } from "@aviala-design/spiral";
import { useState } from "react";
import { DocsLink } from "../../components/DocsLink";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  getAggregatedReleases,
  getSpiralInstallCommand,
  orderedSectionKeys,
  type SpiralPackageManager,
} from "../../changelog-registry";

const PACKAGE_MANAGERS: SpiralPackageManager[] = ["npm", "yarn", "pnpm"];

function formatReleaseDate(iso: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

function ChangelogReleaseHeader({
  version,
  publishedAt,
}: {
  version: string;
  publishedAt?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [menuKey, setMenuKey] = useState(0);

  const copyInstall = async (manager: SpiralPackageManager) => {
    try {
      await navigator.clipboard.writeText(getSpiralInstallCommand(version, manager));
      setCopied(true);
      setMenuKey((key) => key + 1);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="docs-changelog-overview-release-header">
      <Typography level="headline2" as="h2" id={`v-${version}`}>
        {version}
      </Typography>
      <div className="docs-changelog-overview-release-meta">
        {publishedAt ? (
          <Typography level="caption" as="span" className="docs-changelog-overview-release-date">
            {formatReleaseDate(publishedAt)}
          </Typography>
        ) : null}
        <div className="docs-changelog-use-version">
          <Select
            key={menuKey}
            onValueChange={(value) => {
              if (PACKAGE_MANAGERS.includes(value as SpiralPackageManager)) {
                void copyInstall(value as SpiralPackageManager);
              }
            }}
          >
            <div className="docs-changelog-use-version__anchor">
              <SelectTrigger
                className="docs-changelog-use-version__trigger"
                aria-label="使用该版本"
                title="复制该版本的安装命令"
              />
              <Button
                mode="defaultCustom"
                size="small"
                className="docs-changelog-use-version__button"
                tabIndex={-1}
                aria-hidden
              >
                {copied ? "已复制" : "使用该版本"}
              </Button>
            </div>
            <SelectContent align="end">
              <SelectItemGroup>
                {PACKAGE_MANAGERS.map((manager) => (
                  <SelectItem key={manager} value={manager} showFunctionIcon={false}>
                    {manager}
                  </SelectItem>
                ))}
              </SelectItemGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export function ChangelogPage() {
  const releases = getAggregatedReleases();

  return (
    <>
      <DocPageHeader
        title="更新记录"
        description="按 @aviala-design/spiral 版本汇总的组件变更（来自各组件独立 changelog）"
      />
      <div className="docs-prose docs-changelog-overview">
        {releases.length === 0 ? (
          <Typography level="text" as="p">
            暂无组件更新记录。
          </Typography>
        ) : (
          releases.map((release) => (
            <section key={release.version} className="docs-changelog-overview-release">
              <ChangelogReleaseHeader
                version={release.version}
                publishedAt={release.publishedAt}
              />
              <div className="docs-changelog-overview-list">
                {release.changes.map((change) => (
                  <div key={change.component} className="docs-changelog-overview-component">
                    <Typography
                      level="title"
                      as="h3"
                      className="docs-changelog-overview-component-heading"
                    >
                      {change.path ? (
                        <DocsLink
                          to={change.path}
                          mode="noBackgroundCustom"
                          className="docs-changelog-overview-component-name"
                        >
                          {change.component}
                        </DocsLink>
                      ) : (
                        change.component
                      )}
                    </Typography>
                    {orderedSectionKeys(change.sections).map((section) => (
                      <div key={section} className="docs-changelog-section">
                        <Typography level="caption" as="h4" className="docs-changelog-section-title">
                          {section}
                        </Typography>
                        <ul className="docs-changelog-list">
                          {change.sections[section]?.map((item) => (
                            <li key={item}>
                              <Typography level="text" as="span">
                                {item}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </>
  );
}
