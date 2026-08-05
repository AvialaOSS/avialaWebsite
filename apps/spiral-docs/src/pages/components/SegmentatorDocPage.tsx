import { SegmentatorGroup, SegmentatorItem } from "@aviala-design/spiral";
import { useState } from "react";
import { ComponentDocView } from "../../components/ComponentDocView";
import {
  buildSegmentatorCode,
  segmentatorKnobs,
  segmentatorLiveCode,
} from "../../demos/component-demos";

export function SegmentatorDocPage() {
  return (
    <ComponentDocView
      component="SegmentatorGroup"
      scope={{ SegmentatorGroup, SegmentatorItem, useState }}
      fallback={{
        title: "Segmentator 分段器",
        description: "用于在少数互斥视图或模式间快速切换。",
        prose:
          "适合列表/卡片视图切换、筛选维度切换等选项不多的场景。2.6.0 新增 `direction`（`horizontal` / `vertical`）。",
        liveCode: segmentatorLiveCode,
        knobs: segmentatorKnobs,
        buildCode: buildSegmentatorCode,
      }}
    />
  );
}
