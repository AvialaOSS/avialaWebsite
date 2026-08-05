import type { ComponentDocRevision } from "../types";
import {
  buildColorPickerCode,
  colorPickerKnobs,
  colorPickerLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.6.0",
  title: "ColorPicker 颜色选择",
  description: "用于让用户挑选或调整颜色。",
  prose:
    "适合主题定制、标注颜色、设计类设置等需要精确选色的场景。2.6.0 色相 / 透明度轨道复用共有 Slider（新拇指视觉），色相在 HSVA 空间保真（拖到 360° 不再弹回），占位与控件 aria 文案由 LocaleProvider 提供。",
  liveCode: colorPickerLiveCode,
  knobs: colorPickerKnobs,
  buildCode: buildColorPickerCode,
};

export default revision;
