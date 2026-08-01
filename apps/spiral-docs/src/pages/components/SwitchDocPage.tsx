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
        description: "Figma Basic Input → Switch。用于二元状态切换。",
        prose: "支持 regular / small 尺寸，以及 disabled 与受控 / 非受控用法。",
        liveCode: switchLiveCode,
        knobs: switchKnobs,
        buildCode: buildSwitchCode,
      }}
    />
  );
}
