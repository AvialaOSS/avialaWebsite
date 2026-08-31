import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.0.0 + component changelog. Review before marking ready. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.0.0",
  prose: previous.prose + " 3.0.0：`CardHead` / `CardBottom` `actionLabel` 的 `Text` 默认值；未传 `actionLabel` 且未传 `action` 时不再渲染主操作按钮。",
};

export default revision;
