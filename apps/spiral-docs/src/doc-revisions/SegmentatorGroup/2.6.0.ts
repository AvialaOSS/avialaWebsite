import type { ComponentDocRevision } from "../types";
import {
  buildSegmentatorCode,
  segmentatorKnobs,
  segmentatorLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.6.0",
  title: "Segmentator 分段器",
  description: "用于在少数互斥视图或模式间快速切换。",
  prose:
    "适合列表/卡片视图切换、筛选维度切换等选项不多的场景。2.6.0 新增 `direction`：`horizontal`（默认）/ `vertical`，对齐 Figma；竖向布局下拇指与触控拖选沿主轴（Y）工作。内容溢出时仍可横向滚动（隐藏滚动条）。",
  liveCode: segmentatorLiveCode,
  knobs: segmentatorKnobs,
  buildCode: buildSegmentatorCode,
};

export default revision;
