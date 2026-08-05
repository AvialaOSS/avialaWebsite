import type { ComponentDocRevision } from "../types";
import {
  buildTooltipCode,
  tooltipKnobs,
  tooltipLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.6.0",
  title: "Tooltip 工具提示",
  description: "用于在悬停或聚焦时补充简短说明。",
  prose:
    "适合图标按钮、缩略文案等空间不够写全的场景。2.6.0 起 `ResponsiveTooltip` 在触摸端改为**长按**打开（短按仍触发按钮自身点击），可用 `longPressMs` 调整按住时长（默认 500ms）；桌面仍为悬停 / 键盘焦点。",
  liveCode: tooltipLiveCode,
  knobs: tooltipKnobs,
  buildCode: buildTooltipCode,
};

export default revision;
