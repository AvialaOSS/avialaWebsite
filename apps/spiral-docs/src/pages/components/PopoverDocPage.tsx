import {
  Button,
  HoverPopover,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Typography,
} from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { DemoBlock } from "../../components/DemoBlock";
import {
  buildHoverPopoverCode,
  buildPopoverCode,
  hoverPopoverKnobs,
  hoverPopoverLiveCode,
  popoverKnobs,
  popoverLiveCode,
} from "../../demos/component-demos";

export function PopoverDocPage() {
  return (
    <ComponentDocView
      component="Popover"
      scope={{ Popover, PopoverTrigger, PopoverContent, Button }}
      fallback={{
        title: "Popover 弹出层",
        description: "Figma System Composition → Popover。用于富内容浮层面板。",
        prose:
          "基于 Radix Popover，支持四向 placement、箭头与自定义 anchor。`appearance` 可选 default / tooltip / primary；`flush` 去掉默认内边距。悬停富内容见下方 HoverPopover。",
        liveCode: popoverLiveCode,
        knobs: popoverKnobs,
        buildCode: buildPopoverCode,
      }}
    >
      <DemoBlock
        title="HoverPopover"
        initialCode={hoverPopoverLiveCode}
        scope={{ HoverPopover, Button, Typography }}
        knobs={hoverPopoverKnobs}
        buildCode={buildHoverPopoverCode}
      />
    </ComponentDocView>
  );
}
