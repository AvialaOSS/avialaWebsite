import previous from "./3.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "ListItem 保持 0 圆角，由外层包裹负责圆角。顶部分隔线与尾部操作区竖线随外观变化：Default 使用 neutral-2，Deep 使用 neutral-3。颜色、尺寸和交互状态通过组件 Token 配置。",
};

export default revision;
