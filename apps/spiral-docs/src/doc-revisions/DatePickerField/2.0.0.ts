import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  revision: "2.0.0",
  title: "DatePicker 日期选择",
  description: "Figma Information Collect → DatePicker。支持单选、区间选择与日期时间。",
  prose:
    "提供 DatePickerField 便捷封装，也可使用 DatePicker + Trigger + Content 组合式 API。默认启用时间（enableTime），触发器显示 YYYY-MM-DD HH:mm；设为 false 时仅选择日期。时间与月份滚轮支持拖拽、鼠标滚轮与触摸滚动；松手或滚轮停止后会吸附到最近选项并居中高亮。",
  propsKey: "DatePickerField",
};

export default revision;
