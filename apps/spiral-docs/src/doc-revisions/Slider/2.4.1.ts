import type { ComponentDocRevision } from "../types";
import {
  buildSliderCode,
  sliderKnobs,
  sliderLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.4.1",
  title: "Slider 滑块",
  description: "用于在连续范围内拖动选定数值。",
  prose:
    "适合音量、亮度、价格区间等用拖动比键盘输入更直观的调节场景。",
  liveCode: sliderLiveCode,
  knobs: sliderKnobs,
  buildCode: buildSliderCode,
};

export default revision;
