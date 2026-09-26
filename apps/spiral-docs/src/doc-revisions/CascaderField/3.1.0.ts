import previous from "./3.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：禁用输入保持表面不透明，内容与文字按 Figma 图层分别消费组件透明度 Token，占位符不重复淡化；选中项与未选中项共用文字、图标及背景状态，保留选择标记；补齐按下背景，并排除禁用项的交互高亮。",
};

export default revision;
