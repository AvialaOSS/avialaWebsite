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
        description: "Figma Information Collect → Textarea。用于多行文本采集。",
        prose: "支持 regular / big 尺寸、字符计数、图标装饰，以及 error / disabled 状态。",
        liveCode: textareaLiveCode,
        knobs: textareaKnobs,
        buildCode: buildTextareaCode,
      }}
    />
  );
}
