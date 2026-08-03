import { Loading } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildLoadingCode, loadingKnobs, loadingLiveCode } from "../../demos/component-demos";

export function LoadingDocPage() {
  return (
    <ComponentDocView
      component="Loading"
      scope={{ Loading }}
      fallback={{
        title: "Loading 加载",
        description: "用于表示内容或操作仍在进行中。",
        prose: "适合按钮提交中、区块加载中等需要让用户等待的短暂状态。",
        liveCode: loadingLiveCode,
        knobs: loadingKnobs,
        buildCode: buildLoadingCode,
      }}
    />
  );
}
