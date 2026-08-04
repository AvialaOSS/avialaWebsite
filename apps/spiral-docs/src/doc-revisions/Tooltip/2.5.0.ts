import type { ComponentDocRevision } from "../types";
import {
  buildTooltipCode,
  tooltipKnobs,
  tooltipLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.5.0",
  title: "Tooltip 工具提示",
  description: "用于在悬停或聚焦时补充简短说明。",
  prose:
    "适合图标按钮、缩略文案等空间不够写全的场景。2.5.0 起 `TooltipContent` / `ResponsiveTooltip` 支持 `level`：`caption`（默认）或 `text`。",
  liveCode: tooltipLiveCode,
  knobs: tooltipKnobs,
  buildCode: buildTooltipCode,
};

export default revision;
