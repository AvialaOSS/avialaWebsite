import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.0.0 + component changelog. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.0.0",
  prose: previous.prose + " 3.0.0：`SelectSubItem`：焦点在子菜单行上时可用 Up / Down / Home / End 在同层菜单项之间移动；展开方向键（RTL 下镜像）打开子菜单并把焦点送入首项，收起方向键�?Esc 关闭并把焦点送回该行；主菜单�?`SelectSubItem` �?Radix `SelectItem` 混排时，方向键会把焦点送入/送出子菜单行（Radix 集合本身会跳过这些行）；子菜单面板内同样支持 Up / Down / Home / End，导航范围限定在当前面板；`SelectItem` / `SelectSubItem` 开�?`showBadge` 但未�?`badge` 时不再回�?`Text` 占位 Badge；`SelectItem` / `SelectSubItem` 开�?`showMoreFunction` 但未�?`moreAction` 时不再回�?`Text` 占位 Link，尾部槽位整体不渲染�?,
};

export default revision;
