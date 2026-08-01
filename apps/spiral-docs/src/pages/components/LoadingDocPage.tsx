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
        description: "Figma System Composition → Loading Icon。用于加载状态指示。",
        prose: "提供 7 级尺寸与 theme / themeText / black / white 模式，可选 lineHeightFix 对齐修正。",
        liveCode: loadingLiveCode,
        knobs: loadingKnobs,
        buildCode: buildLoadingCode,
      }}
    />
  );
}
