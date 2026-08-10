import previous from "./2.6.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.6.1",
  prose:
    previous.prose +
    " 2.6.1 将 Hover/Active 对齐共享交互 token：Primary 悬停加深、按下变浅；Ghost 走 neutral；Default 走 filled 阶梯。",
};

export default revision;
