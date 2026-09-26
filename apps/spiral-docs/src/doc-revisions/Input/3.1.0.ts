import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "输入背景、边框和状态色通过 BaseInput 组件 Token 消费语义色。hover 与 Button tertiary 一致，保留 70% 透明度；disabled 时使用容器与内容两层透明度，对齐设计层级。已填写文字、占位文字与焦点状态分别处理。",
};

export default revision;
