import { Checkbox } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildCheckboxCode, checkboxKnobs, checkboxLiveCode } from "../../demos/component-demos";

export function CheckboxDocPage() {
  return (
    <ComponentDocView
      component="Checkbox"
      scope={{ Checkbox }}
      fallback={{
        title: "Checkbox 复选框",
        description: "Figma Information Collect → Checkbox。用于多选或布尔开关。",
        prose: "支持方形 / 圆形（round）外观、indeterminate 状态，以及 CheckboxGroup / CheckboxInput 组合。",
        liveCode: checkboxLiveCode,
        knobs: checkboxKnobs,
        buildCode: buildCheckboxCode,
      }}
    />
  );
}
