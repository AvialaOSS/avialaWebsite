import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "五种类型和两种外观使用独立组件 Token。标题、说明和状态图标可分别覆盖；内置链接统一为 noBackgroundCustom，操作区支持 RTL 与窄屏换行。title 支持 ReactNode。",
};

export default revision;
