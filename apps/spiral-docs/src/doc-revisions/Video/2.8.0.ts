import type { ComponentDocRevision } from "../types";
import {
  buildVideoCode,
  videoKnobs,
  videoLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.8.0",
  title: "Video 视频",
  description: "用于在界面中播放与控制视频内容。",
  prose:
    "适合课程预览、产品演示、监控画面等需要内嵌播放器的场景。控件栏提供播放、跳转、倍速、音量、画面比例、音量平衡与全屏；`appearance` 对应 Figma Style（`default` 贴底栏 / `light` 悬浮圆角栏）。开启 `autoHideControls` 后，播放中空闲会下滑淡出控件栏，鼠标移动或点按播放器可再次呼出；暂停时始终显示。播放 / 暂停 / 上一首 / 下一首为动画图标，随按钮操作播放一次。",
  liveCode: videoLiveCode,
  knobs: videoKnobs,
  buildCode: buildVideoCode,
};

export default revision;
