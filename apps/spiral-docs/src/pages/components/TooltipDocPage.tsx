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
          "适合图标按钮、缩略文案等界面空间不够写全、又需要一点提示的场景。",
        liveCode: tooltipLiveCode,
        knobs: tooltipKnobs,
        buildCode: buildTooltipCode,
      }}
    >
      <DemoBlock
        title="ResponsiveTooltip（跨端，触摸保持 tooltip 外观）"
        initialCode={responsiveTooltipLiveCode}
        scope={{ ResponsiveTooltip, TooltipProvider, Button }}
        knobs={responsiveTooltipKnobs}
        buildCode={buildResponsiveTooltipCode}
      />
    </ComponentDocView>
  );
}
