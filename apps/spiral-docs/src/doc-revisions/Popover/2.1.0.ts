import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  revision: "2.1.0",
  title: "Popover 弹出层",
  description: "Figma System Composition → Popover。用于富内容浮层面板。",
  prose:
    "基于 Radix Popover，支持四向 placement、箭头与自定义 anchor。进出场为方向感知动画（自触发点缩放 + 淡入淡出）。`PopoverContent` 可用 `flush` 去掉默认内边距。需要悬停打开富内容时用 `HoverPopover`（桌面悬停/焦点，触摸降级为点按）；键盘打开会把焦点移入内容，关闭后归还触发器。",
};

export default revision;
