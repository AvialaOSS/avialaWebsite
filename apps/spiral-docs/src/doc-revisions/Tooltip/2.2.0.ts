import type { ComponentDocRevision } from "../types";
import {
  buildTooltipCode,
  tooltipKnobs,
  tooltipLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.2.0",
  title: "Tooltip 工具提示",
  description: "用于在悬停或聚焦时补充简短说明。",
  prose:
    "适合图标按钮、缩略文案等界面空间不够写全、又需要一点提示的场景。",
  liveCode: tooltipLiveCode,
  knobs: tooltipKnobs,
  buildCode: buildTooltipCode,
};

export default revision;
