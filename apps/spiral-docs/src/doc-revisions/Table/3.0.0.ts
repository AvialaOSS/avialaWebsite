import previous from "./2.7.0";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.7.0 + component changelog. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.0.0",
  prose: previous.prose + " 3.0.0：`TableCell` `content=\"people\"` 未传 `people` 时，默认头像改用 `users_user` 图标，不再显示 `A` 占位字母；`TableCell` `content=\"badge\"` 未传 `badge` / `badgeLabel` 时不再回填 `Text` 占位 Badge；`TableCell` `content=\"icon-place+text\"` 未传 `iconPlace` / `icon` 时不再渲染 `A` 占位形底，图标位整体省略。",
};

export default revision;
