import { Textarea } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildTextareaCode, textareaKnobs, textareaLiveCode } from "../../demos/component-demos";

export function TextareaDocPage() {
  return (
    <ComponentDocView
      component="Textarea"
      scope={{ Textarea }}
      fallback={{
        title: "Textarea 多行输入",
        description: "用于填写多行较长文本。",
        prose: "适合备注、描述、反馈内容等需要换行书写的录入场景。",
        liveCode: textareaLiveCode,
        knobs: textareaKnobs,
        buildCode: buildTextareaCode,
      }}
    />
  );
}
