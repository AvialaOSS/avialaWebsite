import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  revision: "2.0.0",
  title: "FormField 表单字段",
  description: "用于把标签、说明与输入控件排成完整表单项。",
  prose:
    "适合设置页、注册登录、资料编辑等需要字段语义与控件一起出现的场景。校验失败时把文案写在 FormField 的 `error` 上即可：下方 tip 与子控件描边会一起出现。",
};

export default revision;
