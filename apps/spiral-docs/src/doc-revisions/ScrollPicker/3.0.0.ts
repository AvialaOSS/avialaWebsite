import previous from "./2.6.1";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.6.1 + component changelog. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.0.0",
  prose: previous.prose + " 3.0.0：`loop={false}` 的列滚到首尾后不再吞掉滚轮事件，页面可以继续滚动；loop 列行为不变。",
};

export default revision;
