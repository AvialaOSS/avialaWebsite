import type { ComponentDocRevision } from "../types";
import {
  buildSegmentatorCode,
  segmentatorKnobs,
  segmentatorLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.5.0",
  title: "Segmentator 分段器",
  description: "用于在少数互斥视图或模式间快速切换。",
  prose:
    "适合列表/卡片视图切换、筛选维度切换等选项不多的场景。2.5.0 在内容溢出时可横向滚动（隐藏滚动条）；`equalWidth` 以内容最小宽度为准，选中项会滚入可视区域。",
  liveCode: segmentatorLiveCode,
  knobs: segmentatorKnobs,
  buildCode: buildSegmentatorCode,
};

export default revision;
