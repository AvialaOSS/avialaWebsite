import previous from "./2.6.0";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.6.0 + component changelog. Review before marking ready. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.6.1",
  prose: previous.prose + " 2.6.1：未选项 Hover/Active 使用共享 filled 交互 token；nested 模式下未选项圆角改为与滑动指示器一致（`segmentator-item-nested-radius`），避免 hover / focus 填充与选中拇指圆角不一致。",
};

export default revision;
