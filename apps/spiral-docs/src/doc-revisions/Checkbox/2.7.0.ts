import previous from "./2.5.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.7.0",
  prose:
    previous.prose +
    " 2.7.0 修正半选（`indeterminate`）标记居中：半选态隐藏仍占位的勾选图标，指示层绝对铺满选框。",
};

export default revision;
