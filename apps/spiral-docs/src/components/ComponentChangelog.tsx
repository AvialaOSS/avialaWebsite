import { Typography } from "@aviala-design/spiral";
import { DocsLink } from "./DocsLink";
import {
  getComponentChangelog,
  orderedSectionKeys,
  type ComponentChangelogRelease,
} from "../changelog-registry";

const PREVIEW_LIMIT = 5;

type ComponentChangelogProps = {
  component: string;
  /** When true, show every release (overview-style). Default: recent preview. */
  full?: boolean;
};

function ReleaseBlock({
  release,
  headingLevel = "title",
}: {
  release: ComponentChangelogRelease;
  headingLevel?: "title" | "headline2";
}) {
  const sectionKeys = orderedSectionKeys(release.sections);
  if (sectionKeys.length === 0) return null;

  return (
    <div className="docs-changelog-release">
      <Typography level={headingLevel} as="h3" className="docs-changelog-version">
        {release.version}
      </Typography>
      {sectionKeys.map((section) => (
        <div key={section} className="docs-changelog-section">
          <Typography level="caption" as="h4" className="docs-changelog-section-title">
            {section}
          </Typography>
          <ul className="docs-changelog-list">
            {release.sections[section]?.map((item) => (
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
  );
}

export function ComponentChangelog({ component, full = false }: ComponentChangelogProps) {
  const releases = getComponentChangelog(component);
  if (!releases?.length) return null;

  const shown = full ? releases : releases.slice(0, PREVIEW_LIMIT);
  const hasMore = !full && releases.length > PREVIEW_LIMIT;

  return (
    <section className="docs-changelog" id="changelog" aria-labelledby="docs-changelog-heading">
      <Typography level="title" as="h2" id="docs-changelog-heading">
        更新记录
      </Typography>
      <div className="docs-changelog-releases">
        {shown.map((release) => (
          <ReleaseBlock key={release.version} release={release} />
        ))}
      </div>
      {hasMore || !full ? (
        <p className="docs-changelog-more">
          <DocsLink to="/start/changelog" level="caption" mode="noBackgroundCustom">
            查看全部更新记录
          </DocsLink>
        </p>
      ) : null}
    </section>
  );
}
