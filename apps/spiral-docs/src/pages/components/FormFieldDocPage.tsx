import { FormField, Input } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildFormFieldCode, formFieldKnobs, formFieldLiveCode } from "../../demos/component-demos";

export function FormFieldDocPage() {
  return (
    <ComponentDocView
      component="FormField"
      scope={{ FormField, Input }}
      fallback={{
        title: "FormField 表单字段",
        description: "Figma System Composition → FormField。用于标签、描述与控件组合。",
        prose: "将 label、description 与任意输入控件组合，配合 Stack / Fieldset 构建表单布局。",
        liveCode: formFieldLiveCode,
        knobs: formFieldKnobs,
        buildCode: buildFormFieldCode,
      }}
    />
  );
}
