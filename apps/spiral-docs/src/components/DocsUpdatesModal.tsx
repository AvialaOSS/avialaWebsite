import {
  Modal,
  ModalBody,
  ModalContent,
  ModalHeaderText,
  Typography,
} from "@aviala-design/spiral";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getAggregatedReleases,
  getComponentChangelog,
  orderedSectionKeys,
  type AggregatedRelease,
  type ComponentChangelogRelease,
} from "../changelog-registry";
import { getNavItemByPath } from "../nav";
import { DocsLink } from "./DocsLink";

type DocsUpdatesModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

function ComponentReleaseList({ releases }: { releases: ComponentChangelogRelease[] }) {
  return (
    <div className="docs-changelog-releases">
      {releases.map((release) => {
        const sectionKeys = orderedSectionKeys(release.sections);
        if (sectionKeys.length === 0) return null;
        return (
          <div key={release.version} className="docs-changelog-release">
            <Typography level="title" as="h3" className="docs-changelog-version">
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
      })}
    </div>
  );
}

function AggregatedReleaseList({ releases }: { releases: AggregatedRelease[] }) {
  return (
    <div className="docs-changelog-releases">
      {releases.map((release) => (
        <div key={release.version} className="docs-changelog-overview-release">
          <Typography level="title" as="h3" className="docs-changelog-version">
            {release.version}
          </Typography>
          <div className="docs-changelog-overview-list">
            {release.changes.map((change) => (
              <div key={change.component} className="docs-changelog-overview-component">
                <Typography
                  level="title"
                  as="h4"
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
                    <Typography level="caption" as="h5" className="docs-changelog-section-title">
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
        </div>
      ))}
    </div>
  );
}

export function DocsUpdatesModal({ open, onOpenChange }: DocsUpdatesModalProps) {
  const { pathname } = useLocation();
  const component = getNavItemByPath(pathname)?.component;
  const componentReleases = component ? getComponentChangelog(component) : undefined;
  const aggregated = component ? null : getAggregatedReleases();

  useEffect(() => {
    if (open) onOpenChange(false);
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps -- dismiss only on route change

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalContent size="large" className="docs-updates-modal">
        <ModalHeaderText
          title="更新记录"
          description={
            component ? `${component} 的版本变更。` : "按 Spiral 版本汇总的组件变更。"
          }
        />
        <ModalBody className="docs-updates-modal__body">
          {component ? (
            componentReleases?.length ? (
              <ComponentReleaseList releases={componentReleases} />
            ) : (
              <Typography level="text" as="p">
                暂无此组件的更新记录。
              </Typography>
            )
          ) : aggregated && aggregated.length > 0 ? (
            <AggregatedReleaseList releases={aggregated} />
          ) : (
            <Typography level="text" as="p">
              暂无更新记录。
            </Typography>
          )}
          {component ? (
            <p className="docs-changelog-more">
              <DocsLink to="/start/changelog" level="caption" mode="noBackgroundCustom">
                查看全部组件更新记录
              </DocsLink>
            </p>
          ) : null}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
