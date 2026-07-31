import { Typography } from "@aviala-design/spiral";
import type { ChangeEvent } from "react";
import {
  getCoveredDocsVersions,
  getDefaultDocsVersion,
  getDocsVersionEntry,
} from "../versions-registry";
import {
  getDocsRestPath,
  getDocsVersionFromBasename,
} from "../docs-base";

/**
 * Switch between covered Spiral docs builds.
 * Navigates to `/docs/spiral/v/{version}{rest}` (full page load of that SPA).
 */
export function DocsVersionSwitcher() {
  const versions = getCoveredDocsVersions();
  const bakedVersion = import.meta.env.VITE_DOCS_VERSION || "";
  const urlVersion = getDocsVersionFromBasename();
  const current = bakedVersion || urlVersion || getDefaultDocsVersion();
  const entry = getDocsVersionEntry(current);
  if (versions.length === 0) return null;

  const onChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value;
    if (!next || next === current) return;
    const rest = getDocsRestPath();
    const target = `/docs/spiral/v/${next}${rest === "/" ? "/" : rest}${window.location.search}${window.location.hash}`;
    window.location.assign(target);
  };

  if (versions.length === 1) {
    return (
      <div className="docs-version-switcher" title="文档覆盖的 Spiral 版本">
        <Typography level="caption" as="span" className="docs-version-switcher__label">
          Spiral
        </Typography>
        <Typography level="caption" as="span" className="docs-version-switcher__value">
          {current}
          {entry?.status === "draft" ? " · draft" : ""}
        </Typography>
      </div>
    );
  }

  return (
    <label className="docs-version-switcher docs-version-switcher--select" title="切换文档版本">
      <Typography level="caption" as="span" className="docs-version-switcher__label">
        Spiral
      </Typography>
      <select
        className="docs-version-switcher__select"
        value={current}
        onChange={onChange}
        aria-label="选择 Spiral 文档版本"
      >
        {versions.map((version) => {
          const status = getDocsVersionEntry(version)?.status;
          return (
            <option key={version} value={version}>
              {version}
              {status === "draft" ? " (draft)" : ""}
            </option>
          );
        })}
      </select>
    </label>
  );
}
