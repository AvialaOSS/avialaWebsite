import previous from "./2.1.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：页码采用 Tiled Segmentator 的组件样式和 Token，选中态支持独立背景、文字、圆角与阴影，保留分页按钮语义及显式旧覆盖；容器、翻页按钮区、跳页区与每页条数区接入独立间距 Token，标签消费组件文字颜色；显式旧间距覆盖仍优先；窄容器中页码过多时限制翻页区宽度，页码在内部滚动，避免挤出上一页与下一页按钮。",
};

export default revision;
