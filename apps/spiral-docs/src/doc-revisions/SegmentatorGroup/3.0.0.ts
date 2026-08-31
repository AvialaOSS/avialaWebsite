import previous from "./2.7.0";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.7.0 + component changelog. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.0.0",
  prose: previous.prose + " 3.0.0：键盘操作对�?radiogroup 规范：方向键（horizontal �?Left/Right，vertical �?Up/Down，RTL 自动镜像）在项之间移动并同步选中，Home/End 跳到首尾；改�?roving tabindex：仅选中项参�?Tab 序列（未选中时由首个可用项接管），进入分段控件后用方向键切换�?,
};

export default revision;
