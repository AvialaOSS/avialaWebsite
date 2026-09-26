import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：六个等级的内部高度统一消费现有 avata 组件尺寸 Token，与 Figma 的 ON/OFF 变体一致；各级别头像宽度和已有外层对齐高度接入组件 Token；修复继承的 avatar-size 被组件默认值覆盖的问题；文字头像与图标头像分别消费各自的背景、前景色 Token，圆角与图标尺寸使用组件 Token；字体指标继续共用 Typography；保留显式 avatar-bg/avatar-fg 覆盖，避免旧默认值遮蔽新 Token；传入 imgProps.className 时合并图片基础类，避免头像尺寸和 object-fit 裁切样式丢失。",
};

export default revision;
