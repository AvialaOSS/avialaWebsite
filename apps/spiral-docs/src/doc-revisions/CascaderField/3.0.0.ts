import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.0.0 + component changelog. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.0.0",
  prose: previous.prose + " 3.0.0：`CascaderItem`：Up / Down 在同一列的选项之间移动焦点，Home / End 跳到该列首尾；`title` 行与禁用项自动跳过，跨列仍由展开方向键负责；`CascaderOptionsMenu` `groupTitle`：可选的列分组标题，透传�?`CascaderItemGroup` �?`label`；默认不传即不渲染标题行；`CascaderOptionsMenu` 不再输出硬编码的 `Title` 分组标题；`CascaderItem` 开�?`showBadge` 但未�?`badge` 时不再回�?`Text` 占位 Badge�?,
};

export default revision;
