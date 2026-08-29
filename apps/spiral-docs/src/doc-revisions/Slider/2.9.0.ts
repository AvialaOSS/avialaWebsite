import previous from "./2.6.1";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.6.1 + component changelog. Review before marking ready. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.9.0",
  prose: previous.prose + " 2.9.0：挂载 / 重载 / 切换场景下，拇指与进度条不再从起点动画到当前值；位移过渡仍保留给点击轨道与键盘跳变。",
};

export default revision;
