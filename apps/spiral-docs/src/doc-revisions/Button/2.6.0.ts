import type { ComponentDocRevision } from "../types";
import {
  buildButtonCode,
  buttonKnobs,
  buttonLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.6.0",
  title: "Button 按钮",
  description: "用于提交、确认、取消等需要用户主动触发的操作。",
  prose:
    "适合表单提交、对话框按钮、工具栏动作等点击完成任务的场景；空间很紧时可用更紧凑的排布。2.6.0 新增 `outline` / `outlineCustom` 模式（透明底 + 描边），对齐 Figma Mode=Outline / Outline-Custom。",
  liveCode: buttonLiveCode,
  knobs: buttonKnobs,
  buildCode: buildButtonCode,
};

export default revision;
