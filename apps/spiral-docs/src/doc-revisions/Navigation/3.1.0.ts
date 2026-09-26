import previous from "./2.6.1";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "导航项文字、图标、选中背景和交互状态使用组件 Token，保持水平与垂直布局，字体指标沿用共享 Typography；支持亮暗和密度模式。",
};

export default revision;
