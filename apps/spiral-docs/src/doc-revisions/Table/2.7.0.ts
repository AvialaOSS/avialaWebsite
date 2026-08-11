import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";
import {
  buildTableCode,
  tableKnobs,
  tableLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.7.0",
  description:
    "用于行列对照地浏览结构化数据，支持冻结表头、行选择与多种单元格布局。",
  prose:
    previous.prose +
    " 2.7.0 支持 `stickyHeader` 冻结表头；单元格可配 `caption`、`iconPlace`（`content=\"icon-place+text\"`）与 `grabber`；表头可用 `actions` / `checkboxProps`。",
  liveCode: tableLiveCode,
  knobs: tableKnobs,
  buildCode: buildTableCode,
};

export default revision;
