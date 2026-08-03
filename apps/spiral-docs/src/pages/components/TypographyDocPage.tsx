import { Typography } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildTypographyCode, typographyKnobs, typographyLiveCode } from "../../demos/component-demos";

export function TypographyDocPage() {
  return (
    <ComponentDocView
      component="Typography"
      scope={{ Typography }}
      fallback={{
        title: "Typography 排版",
        description: "用于按语义层级展示标题与正文。",
        prose: "适合页面标题、段落、说明文字等需要统一阅读层级的排版场景。",
        liveCode: typographyLiveCode,
        knobs: typographyKnobs,
        buildCode: buildTypographyCode,
      }}
    />
  );
}
