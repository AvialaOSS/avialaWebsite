import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    ' 3.1.0：AnchorItem 支持可选 description，标题与描述分别消费组件颜色，文本间距与整体未选中透明度可由 Token 调整；分组间距、四级缩进、留白、圆角、竖线宽度与颜色、文字颜色和未选中透明度使用组件 Token，字体指标继续共用 Typography；修复 AnchorItem asChild 传入多个 Slot 子节点导致组合链接失败，保留子链接属性、事件及 ref；选中项默认提供 aria-current="location"，允许显式覆盖。',
};

export default revision;
