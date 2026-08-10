import previous from "./2.6.1";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.6.2",
  prose:
    previous.prose +
    " 2.6.2 行间与尾部竖向分隔线对齐最新 Figma 的 `border-normal-2`，在浅色列表底上更清晰可辨。",
};

export default revision;
