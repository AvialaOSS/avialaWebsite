import previous from "./2.6.1";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：Card 选中态的图标宽度、容器高度以及图标/文字颜色分别接入组件 Token，图标尺寸旧覆盖入口继续有效；指示器宽、高、圆角及颜色接入组件 Token，默认固定宽度居中；显式旧 inset 配置继续使用随按钮宽度计算的兼容行为；TabItem 各样式及 Card 选中态分别消费布局 Token，Card 内容背景和上下圆角可独立覆盖；附件槽与指示区底部留白分离；Default、Tiled、Card 的根间距、留白与背景分别接入组件 Token，保留显式旧覆盖；Card 附件槽恢复设计中的底部留白。",
};

export default revision;
