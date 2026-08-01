import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  revision: "2.1.0",
  title: "Tooltip 工具提示",
  description: "Figma System Composition → Tooltip。用于悬停时的轻量说明。",
  prose:
    "需在 TooltipProvider 内使用，支持四向 placement 与可选箭头。纯悬停 Tooltip 在触摸设备上没有可靠触发；需要跨端一致体验时用 `ResponsiveTooltip`（桌面为 Tooltip，触摸自动切为点按 Popover）。",
};

export default revision;
