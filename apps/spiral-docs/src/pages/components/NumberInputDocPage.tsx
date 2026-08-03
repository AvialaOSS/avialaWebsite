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
        description: "用于填写或微调数值。",
        prose: "适合数量、金额、比例等需要数字输入或步进调整的场景。",
        liveCode: numberInputLiveCode,
        knobs: numberInputKnobs,
        buildCode: buildNumberInputCode,
      }}
    />
  );
}
