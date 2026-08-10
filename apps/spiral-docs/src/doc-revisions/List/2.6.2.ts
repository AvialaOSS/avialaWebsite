import previous from "./2.6.1";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.6.1 + component changelog. Review before marking ready. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.6.2",
  prose: previous.prose + " 2.6.2：行间顶部分割线与尾部竖向分隔线颜色对齐 Figma `border/border-normal-2`（此前误用 `border-normal-1`，中性色重调后几乎不可见）。",
};

export default revision;
