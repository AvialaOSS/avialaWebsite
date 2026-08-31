import previous from "./2.6.1";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.6.1 + component changelog. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.0.0",
  prose: previous.prose + " 3.0.0：日历面板不再使用 `role=\"application\"`，改为 `role=\"group\"`，屏幕阅读器恢复常规浏览模式；日期网格补齐 `role=\"row\"` 行语义，配合已有的 `role=\"gridcell\"` 与方向键 / Home / End / PageUp / PageDown 导航。",
};

export default revision;
