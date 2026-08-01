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
        description: "Figma System Composition → Tooltip。用于悬停时的轻量说明。",
        prose: "需在 TooltipProvider 内使用，支持四向 placement 与可选箭头。",
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
