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
        description: "用于让用户挑选或调整颜色。",
        prose: "适合主题定制、标注颜色、设计类设置等需要精确选色的场景。",
        liveCode: colorPickerLiveCode,
        knobs: colorPickerKnobs,
        buildCode: buildColorPickerCode,
      }}
    />
  );
}
