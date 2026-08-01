import { Alert } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { alertKnobs, alertLiveCode, buildAlertCode } from "../../demos/component-demos";

export function AlertDocPage() {
  return (
    <ComponentDocView
      component="Alert"
      scope={{ Alert }}
      fallback={{
        title: "Alert 提示",
        description: "Figma Response And Feedback → Alert。用于页面级或区块级状态提示。",
        prose: "支持 info、warning、error、success、neutral 等类型，以及 default / light 外观与可选操作区。",
        liveCode: alertLiveCode,
        knobs: alertKnobs,
        buildCode: buildAlertCode,
      }}
    />
  );
}
