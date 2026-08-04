import type { ComponentDocRevision } from "../types";
import {
  buildSliderCode,
  sliderKnobs,
  sliderLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.5.0",
  title: "Slider 滑块",
  description: "用于在连续范围内拖动选定数值，可选显示数值提示。",
  prose:
    "适合音量、亮度、价格区间等调节场景。2.5.0 重绘轨道与拇指视觉，并新增 `showValueTooltip` / `formatValueTooltip`；点击轨道与键盘跳变带过渡，拖动时跟手。",
  liveCode: sliderLiveCode,
  knobs: sliderKnobs,
  buildCode: buildSliderCode,
};

export default revision;
