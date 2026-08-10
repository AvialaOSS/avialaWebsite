import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.6.1",
  prose:
    previous.prose +
    " 2.6.1 月切换改用 `direction/arrowLeftLight` / `direction/arrowRightLight`，箭头按压后沿翻页方向飞出；月/年与时间滚轮支持更灵敏的跨格滚动与打断，loop 走最短路径，选中字色经高亮框裁切随滚轮对齐。",
};

export default revision;
