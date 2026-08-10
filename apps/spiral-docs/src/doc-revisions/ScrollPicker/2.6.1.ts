import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.6.1",
  prose:
    previous.prose +
    " 2.6.1 滚轮支持更灵敏的跨格滚动与打断；loop 走最短路径，选中字色经高亮框裁切随列表对齐。",
};

export default revision;
