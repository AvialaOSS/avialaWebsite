import previous from "./2.5.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.6.1",
  prose:
    previous.prose +
    " 2.6.1 浮层阴影统一为 `BasicShadow-Level4WithLine`。",
};

export default revision;
