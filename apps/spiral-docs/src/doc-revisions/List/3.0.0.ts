import previous from "./2.6.2";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.6.2 + component changelog. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.0.0",
  prose: previous.prose + " 3.0.0：可交互的 `ListItem`（传入 `onClick` 或 `interactive`）现在可以获得焦点：补上 `tabIndex`、`role=\"button\"` 与 Enter / Space 触发，行内 Switch、Button、Select 等控件仍各自响应按键；`disabled` 的可交互行标记 `aria-disabled`；`href` 链接行的行为保持不变；`ListItem` `actionLabel` 的 `Text` 默认值；未传 `actionLabel` 且未传 `action` 时不再渲染主操作按钮。",
};

export default revision;
