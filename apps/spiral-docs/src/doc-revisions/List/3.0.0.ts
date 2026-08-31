import previous from "./2.6.2";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.6.2 + component changelog. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.0.0",
  prose: previous.prose + " 3.0.0：可交互�?`ListItem`（传�?`onClick` �?`interactive`）现在可以获得焦点：补上 `tabIndex`、`role=\"button\"` �?Enter / Space 触发，行�?Switch、Button、Select 等控件仍各自响应按键；`disabled` 的可交互行标�?`aria-disabled`；`href` 链接行的行为保持不变；`ListItem` `actionLabel` �?`Text` 默认值；未传 `actionLabel` 且未�?`action` 时不再渲染主操作按钮�?,
};

export default revision;
