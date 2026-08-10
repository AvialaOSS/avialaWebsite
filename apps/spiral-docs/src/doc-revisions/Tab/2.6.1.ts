import previous from "./2.6.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.6.1",
  prose:
    previous.prose +
    " 2.6.1 Tiled 激活态 Hover/Active 改为 second 面 token 换色。",
};

export default revision;
