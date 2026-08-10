import previous from "./2.6.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.6.1",
  prose:
    previous.prose +
    " 2.6.1 未选项 Hover/Active 使用共享 filled 交互 token；nested 下未选项圆角与滑动指示器一致（`segmentator-item-nested-radius`）。",
};

export default revision;
