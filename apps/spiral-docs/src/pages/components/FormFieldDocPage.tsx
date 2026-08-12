import { Button, Fieldset, FormField, Input } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { DemoBlock } from "../../components/DemoBlock";
import {
  buildFormFieldCode,
  buildFormFieldErrorCode,
  formFieldErrorKnobs,
  formFieldErrorLiveCode,
  formFieldKnobs,
  formFieldLiveCode,
} from "../../demos/component-demos";

export function FormFieldDocPage() {
  return (
    <ComponentDocView
      component="FormField"
      scope={{ FormField, Input, Button, Fieldset }}
      fallback={{
        title: "FormField 表单字段",
        description: "用于把标签、说明与输入控件排成完整表单项。",
        prose:
          "适合设置页、注册登录、资料编辑等需要字段语义与控件一起出现的场景。校验失败时把文案写在 FormField 的 `error` 上即可：下方 tip 与子控件描边会一起出现。",
        liveCode: formFieldLiveCode,
        knobs: formFieldKnobs,
        buildCode: buildFormFieldCode,
      }}
    >
      <DemoBlock
        title="错误 tip 与控件联动"
        description={
          <>
            FormField 的 <code>error</code> 负责底部错误 tip；同字段内的 Input / Textarea /
            NumberInput / SelectTrigger 等会自动进入 error 描边态，不必再手写{" "}
            <code>error={"{true}"}</code>。若只想改控件样式、或 tip
            存在时强制关掉描边，再在控件上显式传 <code>error</code>。react-hook-form
            模式下校验失败同样会联动。可用下方 knobs 试 tip 文案，或把「Input error」切到{" "}
            <code>true</code> / <code>false</code> 看覆盖效果。
          </>
        }
        initialCode={formFieldErrorLiveCode}
        scope={{ FormField, Input, Button, Fieldset }}
        knobs={formFieldErrorKnobs}
        buildCode={buildFormFieldErrorCode}
      />
    </ComponentDocView>
  );
}
