import { RadioGroup, RadioGroupItem, RadioInput } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildRadioCode, radioKnobs, radioLiveCode } from "../../demos/component-demos";

export function RadioDocPage() {
  return (
    <ComponentDocView
      component="RadioGroup"
      scope={{ RadioGroup, RadioGroupItem, RadioInput }}
      fallback={{
        title: "RadioGroup 单选组",
        description: "用于在多个选项里只选一个。",
        prose: "适合支付方式、排序规则、互斥偏好等必须单选的场景。",
        liveCode: radioLiveCode,
        knobs: radioKnobs,
        buildCode: buildRadioCode,
      }}
    />
  );
}
