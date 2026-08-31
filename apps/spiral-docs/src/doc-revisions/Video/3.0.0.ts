import previous from "./2.8.0";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.8.0 + component changelog. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.0.0",
  prose: previous.prose + " 3.0.0：倍速菜单补�?listbox 键盘模型：roving tabindex 让当前倍速成为唯一 Tab 落点，Up / Down / Home / End 在选项间移动，`aria-activedescendant` 指向焦点项�?,
};

export default revision;
