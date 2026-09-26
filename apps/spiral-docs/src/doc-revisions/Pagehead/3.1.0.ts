import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：支持 titleLevel 选择共享 Typography 层级，大标题、正文、caption 分别消费对应颜色 Token；titleAs 独立控制语义标题级别；外层、标题区和操作区消费各自的组件布局 Token，支持独立内边距、间距、圆角及边框宽度覆盖；显式旧 Pagehead 变量仍优先；标题和描述消费 Pagehead 文字颜色 Token，字号、行高和字重继续共用 Typography；修正 title 类型与原生 HTML 属性的交叉限制，允许传入 ReactNode 标题。",
};

export default revision;
