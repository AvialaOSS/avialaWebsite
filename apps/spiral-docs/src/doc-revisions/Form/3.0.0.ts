import type { ComponentDocRevision } from "../types";

/** Scaffolded without a prior revision file. Review before marking ready. */
const revision: ComponentDocRevision = {
  revision: "3.0.0",
  title: "Form",
  description: "3.0.0 变更见下方说明；请补全组件简介。",
  prose: "3.0.0：新增 `./form` 导出条件（`types` / `import` / `require`，并附 `development` 指向 `./src/form.ts`），与主入口保持一致的解析方式；**BREAKING** `Form` 与 `FormField` 移至子路径入口 `@aviala-design/spiral/form`，主入口不再导出它们。迁移方式：`import { Form, FormField } from \"@aviala-design/spiral/form\";`；主入口 `@aviala-design/spiral` 不再引用 `react-hook-form`，未安装该 peer 的项目可以正常引入包内任意组件；`react-hook-form` peer 区间保持 `>=7.50`，并标记为 `peerDependenciesMeta.optional`，仅使用 `/form` 入口时才需要安装。",
};

export default revision;
