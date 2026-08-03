import type { ComponentDocRevision } from "../types";
import {
  buildPopoverCode,
  popoverKnobs,
  popoverLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.2.0",
  title: "Popover 弹出层",
  description: "用于在触发点旁展开一段临时面板。",
  prose:
    "适合筛选浮层、快捷菜单、补充说明等不必占满整页的内容。",
  liveCode: popoverLiveCode,
  knobs: popoverKnobs,
  buildCode: buildPopoverCode,
};

export default revision;
