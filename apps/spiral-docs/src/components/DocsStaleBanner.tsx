import { Typography } from "@aviala-design/spiral";
import npmLatest from "../generated/npm-latest.json";
import { getDefaultDocsVersion, isSemverGreater } from "../versions-registry";

export function DocsStaleBanner() {
  const docsVersion = getDefaultDocsVersion();
  const latest = typeof npmLatest.version === "string" ? npmLatest.version : "";
  if (!latest || !isSemverGreater(latest, docsVersion)) return null;

  return (
    <div className="docs-stale-banner" role="status">
      <Typography level="caption" as="p">
        当前最新 Spiral <code>{latest}</code> 尚未提供文档（文档覆盖至{" "}
        <code>{docsVersion}</code>），内容可能过时。
      </Typography>
    </div>
  );
}
