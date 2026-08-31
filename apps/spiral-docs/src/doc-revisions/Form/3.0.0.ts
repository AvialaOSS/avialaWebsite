import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  revision: "3.0.0",
  title: "Form 表单",
  description: "基于 react-hook-form 的表单容器，统一字段注册与校验提交�?,
  prose:
    "3.0.0 起，`Form` �?`FormField` 从主入口 `@aviala-design/spiral` 移至子路�?`@aviala-design/spiral/form`。迁移方式：`import { Form, FormField } from \"@aviala-design/spiral/form\";`。主入口不再引用 `react-hook-form`，未安装�?peer 的项目仍可正常引入其他组件；`react-hook-form`（`>=7.50`）现�?optional peer，仅在使�?`/form` 时需要安装。包导出新增 `./form` 条件（含 `development` 指向 `./src/form.ts`）�?,
};

export default revision;
