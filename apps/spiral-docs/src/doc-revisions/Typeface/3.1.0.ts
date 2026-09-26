import previous from "./3.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：为每条文字提供稳定的行角色标记，缺少主标题时说明文字仍可使用独立组件颜色。",
};

export default revision;
