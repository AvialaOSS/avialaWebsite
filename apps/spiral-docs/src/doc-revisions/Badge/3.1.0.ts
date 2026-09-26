import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "文字与图标使用独立颜色，尺寸、圆角和间距按档位消费组件 Token。行高对齐区域与实际背景分开，避免背景被额外留白撑高。显式旧覆盖继续有效。",
};

export default revision;
