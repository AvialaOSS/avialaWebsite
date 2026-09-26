import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：拆分外层对齐 padding 与内层内容 padding，分别消费组件 Token；描边按设计放在外侧，不再额外撑高标签。ref、事件与根属性仍保留在外层；左右图标、关闭图标宽度和容器高度接入组件 Token，关闭按钮上下 padding 也可单独覆盖；保留显式旧图标槽高度覆盖；背景、边框、圆角、描边宽度和内容间距接入组件 Token；人物标签采用设计中与文字标签相同的间距；Caption/Text 文字颜色分别消费对应 Token，图标与关闭按钮使用独立图标颜色，并保留显式旧变量覆盖；禁用态仅降低文字、图标和关闭按钮的透明度，背景、边框与人物头像保持不变，与设计绑定一致；旧 tag-disabled-opacity 仍优先控制内容透明度。",
};

export default revision;
