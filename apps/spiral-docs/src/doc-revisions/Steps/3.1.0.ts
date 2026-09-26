import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：六种状态分别消费步骤图标、标题和说明 Token；横纵间距、图标尺寸及圆角、边框、正文间距支持组件级覆盖，显式旧 Steps 变量仍优先；waiting 使用 Figma 对应的 TimeAndDateAlarm 图标，调用方仍可通过 icon 或 StepsIcon children 自定义；StepsItem 的 title 类型支持 ReactNode，不再受原生 HTML title 限制。",
};

export default revision;
