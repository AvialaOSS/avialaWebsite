import { NumberInput } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildNumberInputCode, numberInputKnobs, numberInputLiveCode } from "../../demos/component-demos";

export function NumberInputDocPage() {
  return (
    <ComponentDocView
      component="NumberInput"
      scope={{ NumberInput }}
      fallback={{
        title: "NumberInput 数字输入",
        description: "Figma Information Collect → NumberInput。用于采集数值，可选步进控件。",
        prose: "复用 Input 外壳（尺寸、圆角、图标、error / disabled），并提供上下步进按钮、 <code>min</code> / <code>max</code> / <code>step</code> 约束。样式可选 Default 与 Monospaced（等宽数字排版）。",
        liveCode: numberInputLiveCode,
        knobs: numberInputKnobs,
        buildCode: buildNumberInputCode,
      }}
    />
  );
}
