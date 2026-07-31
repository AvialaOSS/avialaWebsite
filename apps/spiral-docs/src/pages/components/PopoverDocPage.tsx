import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildPopoverCode, popoverKnobs, popoverLiveCode } from "../../demos/component-demos";

export function PopoverDocPage() {
  return (
    <ComponentDocView
      component="Popover"
      scope={{ Popover, PopoverTrigger, PopoverContent, Button }}
      fallback={{
        title: "Popover 弹出层",
        description: "Figma System Composition → Popover。用于富内容浮层面板。",
        prose: "基于 Radix Popover，支持四向 placement、箭头与自定义 anchor 元素。",
        liveCode: popoverLiveCode,
        knobs: popoverKnobs,
        buildCode: buildPopoverCode,
      }}
    />
  );
}
