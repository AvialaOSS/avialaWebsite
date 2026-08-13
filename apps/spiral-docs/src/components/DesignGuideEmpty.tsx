import { Typography } from "@aviala-design/spiral";

/** Empty state when design guide is missing, draft, or published without prose. */
export function DesignGuideEmpty() {
  return (
    <div className="docs-design-guide-empty" role="status">
      <Typography level="subtitle" as="h2" className="docs-design-guide-empty__title">
        敬请期待
      </Typography>
      <Typography level="text" as="p" className="docs-design-guide-empty__body">
        设计与使用指南还在准备中，完成发布后会在这里展示。
      </Typography>
    </div>
  );
}
