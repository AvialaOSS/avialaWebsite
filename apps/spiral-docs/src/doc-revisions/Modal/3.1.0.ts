import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：操作区补齐按钮组与按钮插槽，外层、组内和按钮间距分别消费 Token，旧按钮间距覆盖仍有效；补齐头部内容区、标题区、图标内部容器与关闭按钮插槽，分别消费间距、留白和图标尺寸 Token；头部标题、说明和正文标题、内容分别消费组件文字颜色 Token；移除正文首行强制字重，避免无标题时将正文误加粗；根容器的圆角、边框厚度与颜色，以及头部、正文和操作区的背景、留白、分隔线接入各自组件 Token；保留显式旧背景、圆角和分区留白覆盖；新增项目主题示例验证亮暗模式和独立覆盖。",
};

export default revision;
