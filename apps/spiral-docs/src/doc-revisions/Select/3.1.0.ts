import previous from "./3.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "Select 用于单选文字展示，多个值用 MultiSelect 标签模式。选中项目仅增加主题高亮色 check 图标，文字、默认背景与 hover/active 背景均和未选中项目一致。面板颜色、尺寸和效果消费组件 Token。SelectSearch 复用 InputProps，在 SelectContent 内提供搜索输入行，通过 value/onChange 管理关键词，过滤选项与空结果由调用方实现；方向键可进入结果列表。",
};

export default revision;
