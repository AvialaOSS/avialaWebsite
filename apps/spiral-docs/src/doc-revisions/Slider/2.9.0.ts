import previous from "./2.6.1";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.9.0",
  prose:
    previous.prose +
    " 2.9.0 修复挂载、重载与类型切换时拇指与进度条从起点滑入当前值的问题；点击轨道与键盘跳变仍保留位移过渡。",
};

export default revision;
