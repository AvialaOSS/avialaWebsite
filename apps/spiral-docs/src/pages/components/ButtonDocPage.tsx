import { Button, Typography } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import {
  buildButtonCode,
  buttonKnobs,
  buttonLiveCode,
} from "../../demos/component-demos";

export function ButtonDocPage() {
  return (
    <ComponentDocView
      component="Button"
      scope={{ Button }}
      fallback={{
        title: "Button 按钮",
        description: "Figma Basic Input → Button。支持多种 mode、尺寸与图标组合。",
        prose:
          "用于触发操作的主交互控件。可在下方实时编辑代码，或通过 API 调参面板切换 props、左右图标与 iconOnly。`compact` 会去掉最小宽度约束（`min-w-0`），适合工具栏等窄空间。",
        liveCode: buttonLiveCode,
        knobs: buttonKnobs,
        buildCode: buildButtonCode,
      }}
    />
  );
}
