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
        description: "单行文本输入，支持 regular / big 尺寸。",
        prose: "用于采集短文本。可在编辑器中修改 JSX，或通过 API 调参切换 size、placeholder，以及左右图标的显示与图标选择。",
        liveCode: inputLiveCode,
        knobs: inputKnobs,
        buildCode: buildInputCode,
      }}
    />
  );
}
