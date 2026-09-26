import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：主标题为空时，说明文字仍使用说明 Token，不因节点顺序变化而误用标题样式；背景、边框、文字和状态图标改为消费各变体的 Feedback Token；Primary Wrong 按尺寸使用独立图标颜色，显式旧颜色覆盖仍优先；外层留白、圆角、描边及内容间距、图标尺寸接入组件级 Token，显式旧布局覆盖继续优先；窄屏下长操作文字允许完整换行，不再把关闭按钮挤出可见区域；Primary 关闭图标正确消费共享文字前景色，显式旧关闭颜色覆盖不再被内部 Link 图标规则遮蔽；状态图标按 Figma 统一使用 Regular 填充形态，Normal 改用信息图标；自定义 icon 继续优先；Small Primary 标题的组件颜色不再被共享 Typography 白色规则覆盖；无说明文字时标题不再误用说明颜色，title 支持 ReactNode。",
};

export default revision;
