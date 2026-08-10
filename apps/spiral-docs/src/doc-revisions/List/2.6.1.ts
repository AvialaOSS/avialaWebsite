import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.6.1",
  prose:
    previous.prose +
    " 2.6.1 可交互行 Hover/Active 对齐共享 filled 交互 token。",
};

export default revision;
