import previous from "./3.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：标签、说明、必填标记及横纵布局间距改为消费 Form 组件级 Token，字体指标继续共用 Typography。",
};

export default revision;
