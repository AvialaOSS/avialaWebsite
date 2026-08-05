import type { ComponentDocRevision } from "../types";
import {
  buildTabCode,
  tabKnobs,
  tabLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.6.0",
  title: "Tab 标签页",
  description: "用于在同一视图内切换互斥内容分区。",
  prose:
    "对齐 Figma Structure Navigation → Tab，提供 Default（下划线指示条）、Tiled（填充）、Card（页签 + 侧翼）三种样式；可选 `background`、左右插槽。TabItem 内部复用 Button 模式。Default 指示条高 4px、左右内缩 12px；Card 在 `background=\"default\"` 时使用灰底以保证白底页签可读。使用前请引入 `@aviala-design/tokens/tab-effects.css`。",
  liveCode: tabLiveCode,
  knobs: tabKnobs,
  buildCode: buildTabCode,
};

export default revision;
