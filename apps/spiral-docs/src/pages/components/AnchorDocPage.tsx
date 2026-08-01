import { Anchor, AnchorItem } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { anchorKnobs, anchorLiveCode, buildAnchorCode } from "../../demos/component-demos";

export function AnchorDocPage() {
  return (
    <ComponentDocView
      component="Anchor"
      scope={{ Anchor, AnchorItem }}
      fallback={{
        title: "Anchor 锚点",
        description: "Figma System Composition → Anchor。用于页面内章节导航。",
        prose: "支持 0–3 级缩进与 activated 激活态，常用于文档目录或 TOC 侧栏。",
        liveCode: anchorLiveCode,
        knobs: anchorKnobs,
        buildCode: buildAnchorCode,
      }}
    />
  );
}
