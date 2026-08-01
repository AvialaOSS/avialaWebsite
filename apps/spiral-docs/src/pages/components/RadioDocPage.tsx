import { RadioGroup, RadioGroupItem } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildRadioCode, radioKnobs, radioLiveCode } from "../../demos/component-demos";

export function RadioDocPage() {
  return (
    <ComponentDocView
      component="RadioGroup"
      scope={{ RadioGroup, RadioGroupItem }}
      fallback={{
        title: "RadioGroup 单选组",
        description: "Figma Information Collect → Radio。用于互斥选项选择。",
        prose: "提供 RadioGroupItem 基础控件与 RadioInput 卡片式选项，支持 vertical / horizontal 布局。",
        liveCode: radioLiveCode,
        knobs: radioKnobs,
        buildCode: buildRadioCode,
      }}
    />
  );
}
