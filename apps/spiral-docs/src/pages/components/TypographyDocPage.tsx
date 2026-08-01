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
        description: "Figma System Composition → Typography。用于语义化文字层级。",
        prose: "提供 display 至 caption 共 7 级文字样式，支持 text / number 内容与 default / white 色调。",
        liveCode: typographyLiveCode,
        knobs: typographyKnobs,
        buildCode: buildTypographyCode,
      }}
    />
  );
}
