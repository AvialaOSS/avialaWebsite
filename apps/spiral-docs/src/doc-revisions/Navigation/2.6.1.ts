import previous from "./2.5.0";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.5.0 + component changelog. Review before marking ready. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.6.1",
  prose: previous.prose + " 2.6.1：激活项 second 面 Hover/Active 改为 token 换色（不再依赖 brightness）。",
};

export default revision;
