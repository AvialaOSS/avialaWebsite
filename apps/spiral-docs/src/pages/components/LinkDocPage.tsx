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
        description: "用于跳转页面或触发内联操作。",
        prose: "适合正文中的导航、次要操作入口等文字链接触达的场景。",
        liveCode: linkLiveCode,
        knobs: linkKnobs,
        buildCode: buildLinkCode,
      }}
    />
  );
}
