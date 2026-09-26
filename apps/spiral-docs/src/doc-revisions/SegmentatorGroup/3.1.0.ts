import previous from "./3.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "支持 default、tiled 与 nested 外观。Nested 选中项阴影对齐 Figma 的 0/4/16/0、黑色 6%，通过组件 Token 接入效果 ON/OFF。",
};

export default revision;
