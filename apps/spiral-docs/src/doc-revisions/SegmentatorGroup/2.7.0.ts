import previous from "./2.6.1";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.7.0",
  prose:
    previous.prose +
    " 2.7.0 nested 轨道 Hover 使用 `segmentator-bg-hover`（filled-hover）；共享 `BasicShadow-Level4WithLine` 发丝线透明度调整为 18%。",
};

export default revision;
