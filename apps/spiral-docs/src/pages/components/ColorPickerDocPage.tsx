import { useState } from "react";
import { ColorPicker, ColorPickerContent, ColorPickerTrigger } from "@aviala-design/spiral";
import { ComponentDocView } from "../../components/ComponentDocView";
import {
  buildColorPickerCode,
  colorPickerKnobs,
  colorPickerLiveCode,
} from "../../demos/component-demos";

export function ColorPickerDocPage() {
  return (
    <ComponentDocView
      component="ColorPicker"
      scope={{
        ColorPicker,
        ColorPickerTrigger,
        ColorPickerContent,
        useState,
      }}
      fallback={{
        title: "ColorPicker 颜色选择",
        description: "Figma Information Collect → ColorPicker。用于颜色选取与预设管理。",
        prose: "组合式 API：ColorPicker + Trigger + Content。支持透明度、预设色板与 allRound 外观。",
        liveCode: colorPickerLiveCode,
        knobs: colorPickerKnobs,
        buildCode: buildColorPickerCode,
      }}
    />
  );
}
