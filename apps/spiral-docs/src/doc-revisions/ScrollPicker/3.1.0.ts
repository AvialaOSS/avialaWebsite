import previous from "./3.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "滚动选择器使用组件级颜色与尺寸 Token，支持键盘选择与滚轮交互。最新滚轮停止、边界与单位处理已通过自动化测试，真实浏览器和触控体验尚待验收。",
};

export default revision;
