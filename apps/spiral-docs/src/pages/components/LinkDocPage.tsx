import { Link } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildLinkCode, linkKnobs, linkLiveCode } from "../../demos/component-demos";

export function LinkDocPage() {
  return (
    <ComponentDocView
      component="Link"
      scope={{ Link }}
      fallback={{
        title: "Link 链接",
        description: "Figma Basic Input → Link。用于导航或内联操作链接。",
        prose: "支持 caption / text 层级、noBackground 模式，以及左右图标与 iconOnly 变体。",
        liveCode: linkLiveCode,
        knobs: linkKnobs,
        buildCode: buildLinkCode,
      }}
    />
  );
}
