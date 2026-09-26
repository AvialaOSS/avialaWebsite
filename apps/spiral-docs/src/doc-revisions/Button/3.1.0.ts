import previous from "./2.6.1";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "使用 Figma 命名的 primary、secondary、tertiary、tertiaryCustom、noBackground、noBackgroundCustom、outline、outlineCustom。旧 default、defaultCustom、second 分别兼容映射为 tertiary、tertiaryCustom、secondary。组件分别消费各模式的 default/hover/active 背景 Token，并独立使用 x/y padding。iconOnly 按图标对应 Typography 行高撑出正方形内容区；allRound 包括 tiny 均为完整胶囊。destructive 保留 Web 兼容行为，暂无对应 Figma 变体。",
};

export default revision;
