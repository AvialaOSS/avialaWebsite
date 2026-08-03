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
        description: "用于长页面内的章节跳转与当前位置提示。",
        prose: "适合文档、帮助中心、设置长页等需要目录侧栏或页内导航的场景。",
        liveCode: anchorLiveCode,
        knobs: anchorKnobs,
        buildCode: buildAnchorCode,
      }}
    />
  );
}
