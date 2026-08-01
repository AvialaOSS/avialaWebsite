import type { ComponentDocRevision } from "../types";
import {
  buildTooltipCode,
  tooltipKnobs,
  tooltipLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.2.0",
  title: "Tooltip 工具提示",
  description: "Figma System Composition → Tooltip。用于悬停时的轻量说明。",
  prose:
    "需在 TooltipProvider 内使用，支持四向 placement 与可选箭头。跨端场景请用 `ResponsiveTooltip`：桌面为悬停/焦点 Tooltip；触摸为点按，并自 2.2.0 起保持 tooltip 外观（反色皮肤），不再切换成浅色 popover 面板。",
  liveCode: tooltipLiveCode,
  knobs: tooltipKnobs,
  buildCode: buildTooltipCode,
};

export default revision;
