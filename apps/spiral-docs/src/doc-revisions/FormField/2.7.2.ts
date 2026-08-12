import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.0.0 + component changelog. Review before marking ready. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.7.2",
  prose: previous.prose + " 2.7.2：存在错误 tip（layout `error` 或 RHF 校验信息）时，子级 Input / Textarea / NumberInput / SelectTrigger / Cascader / DatePicker / TimePicker 自动进入 error 态；控件上显式 `error` 优先于联动。",
};

export default revision;
