import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.7.0",
  prose:
    previous.prose +
    " 2.7.0 对齐最新 Figma：条形高度 6 / 8px（`default` / `big`），轨道为浅色底且无描边；环形半径按半宽减半线宽计算，轨道色随 `type` 变化。",
};

export default revision;
