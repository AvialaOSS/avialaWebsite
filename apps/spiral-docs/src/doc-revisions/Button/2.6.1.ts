import previous from "./2.6.0";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.6.0 + component changelog. Review before marking ready. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.6.1",
  prose: previous.prose + " 2.6.1：Hover/Active 改为共享交互 token：Primary 悬停加深、按下变浅；Ghost 使用 neutral-3 → lightBackground-1；Default 使用 filled 1→2 阶。",
};

export default revision;
