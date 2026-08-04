import type { ComponentDocRevision } from "../types";
import {
  buildCheckboxCode,
  checkboxKnobs,
  checkboxLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.5.0",
  title: "Checkbox 复选框",
  description: "用于多选或勾选是否同意某项；支持 default / huge 尺寸。",
  prose:
    "适合筛选项、权限勾选、同意条款等场景。2.5.0 新增 `size=\"huge\"`（对齐 Figma Size=Huge），勾选描边动效可中途打断，取消勾选时表面色交叉淡入淡出。",
  liveCode: checkboxLiveCode,
  knobs: checkboxKnobs,
  buildCode: buildCheckboxCode,
};

export default revision;
