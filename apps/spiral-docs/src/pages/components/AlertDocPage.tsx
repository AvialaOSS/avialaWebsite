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
        description: "用于在页面或区块内提示重要状态，需要用户留意时。",
        prose: "适合成功、警告、错误等结果提示，以及需要附带简短说明或后续操作的场景。",
        liveCode: alertLiveCode,
        knobs: alertKnobs,
        buildCode: buildAlertCode,
      }}
    />
  );
}
