import {
  DirectionArrowLeft,
  DirectionArrowRight,
  GeneralSetting,
} from "@aviala-design/icons";
import { Button, Typography } from "@aviala-design/spiral";
import { useState } from "react";
import { ComponentDocView } from "../../components/ComponentDocView";
import { buildTabCode, tabKnobs, tabLiveCode } from "../../demos/component-demos";
import { Tab, TabItem, spiralHasTab } from "../../lib/spiral-optional";

export function TabDocPage() {
  if (!spiralHasTab || !Tab || !TabItem) {
    return (
      <Typography level="text" as="p">
        Tab 自 Spiral 2.6.0 起提供。请切换到 2.6.0 或更新的文档版本查看。
      </Typography>
    );
  }

  return (
    <ComponentDocView
      component="Tab"
      scope={{
        Tab,
        TabItem,
        Button,
        useState,
        GeneralSetting,
        DirectionArrowLeft,
        DirectionArrowRight,
      }}
      fallback={{
        title: "Tab 标签页",
        description: "用于在同一视图内切换互斥内容分区。",
        prose:
          "对齐 Figma Structure Navigation → Tab，提供 Default（下划线指示条）、Tiled（填充）、Card（页签 + 侧翼）三种样式；可选 `background`、左右插槽。TabItem 内部复用 Button 模式。Default 指示条高 4px、左右内缩 12px；Card 在 `background=\"default\"` 时使用灰底以保证白底页签可读。使用前请引入 `@aviala-design/tokens/tab-effects.css`。",
        liveCode: tabLiveCode,
        knobs: tabKnobs,
        buildCode: buildTabCode,
      }}
    />
  );
}
