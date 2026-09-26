import previous from "./2.6.1";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "新增 PopoverIcon 内容插槽，按普通、主题和 tooltip 外观使用独立图标 Token。外层与内容 Slot 分别控制留白，flush 同时清除两层。tooltip 默认使用 Text 字级；面板、指针和阴影接入组件 Token，保持局部主题及可用空间边界。",
};

export default revision;
