import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.0.0 + component changelog. Review before marking ready. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.6.1",
  prose: previous.prose + " 2.6.1：可交互行 Hover/Active 对齐共享 filled 交互 token（lightBackground-2 / Background-3）。",
};

export default revision;
