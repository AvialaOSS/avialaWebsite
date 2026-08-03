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
        description: "用于多选或勾选是否同意某项。",
        prose: "适合筛选项、权限勾选、同意条款等可同时选多项或单独开关的场景。",
        liveCode: checkboxLiveCode,
        knobs: checkboxKnobs,
        buildCode: buildCheckboxCode,
      }}
    />
  );
}
