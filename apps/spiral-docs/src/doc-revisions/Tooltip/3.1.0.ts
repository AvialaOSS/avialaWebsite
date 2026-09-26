import previous from "./2.6.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "文字、图标、背景、指针、布局和阴影使用组件 Token。默认共享 Text 字级，显式 caption 仍可用；ResponsiveTooltip 保留桌面悬浮与移动长按交互。",
};

export default revision;
