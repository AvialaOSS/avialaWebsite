import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemGroup,
  SelectTrigger,
  SelectValue,
} from "@aviala-design/spiral";
import {
  getCoveredDocsVersions,
  getDefaultDocsVersion,
  getDocsVersionEntry,
} from "../versions-registry";
import { getDocsRestPath } from "../docs-base";
import { useDocsVersion } from "./DocsVersionProvider";

type DocsVersionSwitcherProps = {
  /** Compact control for the page header title row. */
  variant?: "default" | "header";
  className?: string;
};

function hardNavigateToDocsVersion(next: string, current: string) {
  if (!next || next === current) return;
  const rest = getDocsRestPath();
  const pathRest = rest === "/" ? "/" : rest;
  const target = `/docs/spiral/v/${next}${pathRest}${window.location.search}${window.location.hash}`;
  window.location.assign(target);
}

/**
 * Switch between covered Spiral docs versions.
 * Production / baked SPAs hard-navigate to `/docs/spiral/v/{version}/`.
 * Local unversioned Vite soft-switches content revisions in place.
 */
export function DocsVersionSwitcher({
  variant = "default",
  className,
}: DocsVersionSwitcherProps) {
  const versions = getCoveredDocsVersions();
  const { version: current, setVersion, hardNavigate } = useDocsVersion();
  if (versions.length === 0) return null;

  const rootClass = [
    "docs-version-switcher",
    variant === "header" ? "docs-version-switcher--header" : null,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const onValueChange = (next: string) => {
    if (!next || next === current) return;
    if (hardNavigate) {
      hardNavigateToDocsVersion(next, current);
      return;
    }
    setVersion(next);
  };

  return (
    <div className={rootClass}>
      <Select value={current} onValueChange={onValueChange}>
        <SelectTrigger
          className="docs-version-switcher__trigger"
          aria-label="选择 Spiral 文档版本"
          title="切换所阅读的 Spiral 文档版本"
        >
          <SelectValue placeholder="选择版本" />
        </SelectTrigger>
        <SelectContent>
          <SelectItemGroup>
            {versions.map((version) => {
              const status = getDocsVersionEntry(version)?.status;
              const label =
                status === "draft"
                  ? `${version} (draft)`
                  : version === getDefaultDocsVersion()
                    ? `${version}（默认）`
                    : version;
              return (
                <SelectItem key={version} value={version} itemFunction="radio">
                  {label}
                </SelectItem>
              );
            })}
          </SelectItemGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
