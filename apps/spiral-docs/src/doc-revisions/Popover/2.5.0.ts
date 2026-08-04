import type { ComponentDocRevision } from "../types";
import {
  buildPopoverCode,
  popoverKnobs,
  popoverLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.5.0",
  title: "Popover 弹出层",
  description: "用于在触发点旁展开一段临时面板。",
  prose:
    "适合筛选浮层、快捷菜单、补充说明等不必占满整页的内容。2.5.0 起 `PopoverContent` 支持 `level`（`caption` | `text`）；未传时 `appearance=\"tooltip\"` 默认 caption，其余外观默认 text。",
  liveCode: popoverLiveCode,
  knobs: popoverKnobs,
  buildCode: buildPopoverCode,
};

export default revision;
