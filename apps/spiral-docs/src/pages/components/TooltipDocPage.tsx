import {
  Button,
  ResponsiveTooltip,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { DemoBlock } from "../../components/DemoBlock";
import {
  buildResponsiveTooltipCode,
  buildTooltipCode,
  responsiveTooltipKnobs,
  responsiveTooltipLiveCode,
  tooltipKnobs,
  tooltipLiveCode,
} from "../../demos/component-demos";

export function TooltipDocPage() {
  return (
    <ComponentDocView
      component="Tooltip"
      scope={{
        Tooltip,
        TooltipTrigger,
        TooltipContent,
        TooltipProvider,
        Button,
      }}
      fallback={{
        title: "Tooltip 工具提示",
        description: "用于在悬停或聚焦时补充简短说明。",
        prose:
          "适合图标按钮、缩略文案等空间不够写全的场景。2.6.0 起 `ResponsiveTooltip` 触摸端改为长按打开（`longPressMs`，默认 500ms）。",
        liveCode: tooltipLiveCode,
        knobs: tooltipKnobs,
        buildCode: buildTooltipCode,
      }}
    >
      <DemoBlock
        title="ResponsiveTooltip（跨端，触摸长按，同款 tooltip 外观）"
        initialCode={responsiveTooltipLiveCode}
        scope={{ ResponsiveTooltip, TooltipProvider, Button }}
        knobs={responsiveTooltipKnobs}
        buildCode={buildResponsiveTooltipCode}
      />
    </ComponentDocView>
  );
}
