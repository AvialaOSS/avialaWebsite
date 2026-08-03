import { Switch } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildSwitchCode, switchKnobs, switchLiveCode } from "../../demos/component-demos";

export function SwitchDocPage() {
  return (
    <ComponentDocView
      component="Switch"
      scope={{ Switch }}
      fallback={{
        title: "Switch 开关",
        description: "用于立即开关某项设置。",
        prose: "适合通知开关、功能启用等二元偏好，改完即生效的场景。",
        liveCode: switchLiveCode,
        knobs: switchKnobs,
        buildCode: buildSwitchCode,
      }}
    />
  );
}
