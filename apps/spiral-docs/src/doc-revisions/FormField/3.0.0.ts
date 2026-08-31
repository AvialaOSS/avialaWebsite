import previous from "./2.7.2";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.7.2 + component changelog. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.0.0",
  prose: previous.prose + " 3.0.0：**BREAKING** `FormField` 从主入口移至 `@aviala-design/spiral/form`（layout 模式与 react-hook-form 模式均在此入口）。迁移方式：`import { FormField } from \"@aviala-design/spiral/form\";`；`useResolvedControlError` 仍从主入口导出，Input / Textarea / Select / NumberInput / Cascader / DatePicker / TimePicker 的 error 联动行为不变。",
};

export default revision;
