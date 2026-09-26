import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：BreadcrumbItem 支持 description，在 Default 尺寸显示 caption 说明并消费独立颜色与文字间距 Token；Small 按设计保持单行；弹出菜单复用 Select Menu 的背景、边框、圆角、分组与菜单项布局和图标 Token，移除 Popover 内容层的重复内边距；折叠按钮外层、留白层和内容层接入 Storage Token，内部复用 tiny/noBackgroundCustom Button；仅图标在收起时降低透明度，展开时恢复；普通项与分隔符按 Figma 拆分外层、留白层和内容层，Default/Small 分别消费组件布局 Token；文字、图标、分隔符颜色与透明度支持独立覆盖；图标容器高度独立于图标宽度，字体指标继续共用 Typography；显式旧 Breadcrumb 布局覆盖仍保留；菜单 hover 背景与阴影策略仍使用现有兼容行为。",
};

export default revision;
