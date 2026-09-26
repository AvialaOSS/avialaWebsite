import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "上传区域、文字、按钮和状态样式接入组件 Token。图标保留当前方案，尚未完成全部组件级 Token 适配；不要将该项理解为 Figma 与 Web 已逐像素验收。",
};

export default revision;
