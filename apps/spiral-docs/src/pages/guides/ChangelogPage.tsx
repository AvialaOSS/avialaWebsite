import { Typography } from "@aviala-design/spiral";
import { DocsLink } from "../../components/DocsLink";
import { DocPageHeader } from "../../components/TableOfContents";
import {
  getAggregatedReleases,
  orderedSectionKeys,
} from "../../changelog-registry";

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
              <Typography level="headline2" as="h2" id={`v-${release.version}`}>
                {release.version}
              </Typography>
              {release.changes.map((change) => (
                <div key={change.component} className="docs-changelog-overview-component">
                  <Typography level="title" as="h3">
                    {change.path ? (
                      <DocsLink to={change.path} mode="noBackgroundCustom">
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
            </section>
          ))
        )}
      </div>
    </>
  );
}
