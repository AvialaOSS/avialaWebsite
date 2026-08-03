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
        description: "用于把标签、说明与输入控件排成完整表单项。",
        prose: "适合设置页、注册登录、资料编辑等需要字段语义与控件一起出现的场景。",
        liveCode: formFieldLiveCode,
        knobs: formFieldKnobs,
        buildCode: buildFormFieldCode,
      }}
    />
  );
}
