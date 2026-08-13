import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";
import {
  buildFormFieldErrorCode,
  formFieldErrorKnobs,
  formFieldErrorLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.7.2",
  prose:
    previous.prose +
    " 2.7.2 起，字段出现错误 tip（`error` 或 react-hook-form 校验信息）时，内部的 Input、Textarea、NumberInput、Select、Cascader、DatePicker、TimePicker 会同步显示错误描边；控件上单独写的 `error` 仍然优先。",
  liveCode: formFieldErrorLiveCode,
  knobs: formFieldErrorKnobs,
  buildCode: buildFormFieldErrorCode,
};

export default revision;
