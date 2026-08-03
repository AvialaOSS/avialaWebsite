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
        description: "用于在触发点旁展开一段临时面板。",
        prose:
          "适合筛选浮层、快捷菜单、补充说明等不必占满整页的内容。",
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
