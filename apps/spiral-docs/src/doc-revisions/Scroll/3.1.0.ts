import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：滚动条宽度、滑块颜色、圆角和留白接入组件 Token，保留显式旧变量覆盖；小尺寸滑块默认使用设计中的 2px 内缩；支持 WebKit 滚动条的浏览器不再被标准 thin 样式遮蔽自定义尺寸。",
};

export default revision;
