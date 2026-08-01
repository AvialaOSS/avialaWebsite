import type { ComponentDocRevision } from "../types";
import {
  buildPopoverCode,
  popoverKnobs,
  popoverLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.2.0",
  title: "Popover 弹出层",
  description: "Figma System Composition → Popover。用于富内容浮层面板。",
  prose:
    "基于 Radix Popover，支持四向 placement、箭头与自定义 anchor。进出场为方向感知动画。`PopoverContent` 可用 `flush` 去掉默认内边距；`appearance` 可选 `default`（浅色面板）、`tooltip`（反色提示皮肤）、`primary`（品牌主色表面、白字）。需要悬停打开富内容时用 `HoverPopover`（桌面悬停/焦点，触摸降级为点按）。",
  liveCode: popoverLiveCode,
  knobs: popoverKnobs,
  buildCode: buildPopoverCode,
};

export default revision;
