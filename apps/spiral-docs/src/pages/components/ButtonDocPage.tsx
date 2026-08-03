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
        description: "用于提交、确认、取消等需要用户主动触发的操作。",
        prose:
          "适合表单提交、对话框按钮、工具栏动作等点击完成任务的场景；空间很紧时可用更紧凑的排布。",
        liveCode: buttonLiveCode,
        knobs: buttonKnobs,
        buildCode: buildButtonCode,
      }}
    />
  );
}
