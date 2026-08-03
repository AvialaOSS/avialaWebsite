import { Input } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildInputCode, inputKnobs, inputLiveCode } from "../../demos/component-demos";

export function InputDocPage() {
  return (
    <ComponentDocView
      component="Input"
      scope={{ Input }}
      fallback={{
        title: "Input 输入框",
        description: "用于填写一行短文本。",
        prose: "适合姓名、标题、搜索词等单行信息的录入。",
        liveCode: inputLiveCode,
        knobs: inputKnobs,
        buildCode: buildInputCode,
      }}
    />
  );
}
