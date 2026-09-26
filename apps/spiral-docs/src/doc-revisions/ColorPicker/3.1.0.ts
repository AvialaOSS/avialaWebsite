import previous from "./2.6.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    "触发器新增可选 leadingIcon/trailingIcon，ColorPickButton 提供 trailingIcon，分别使用组件图标尺寸与颜色。预设色块按规范化色值判断选中。面板、输入区与渐变裁切接入组件 Token，弹层和格式菜单保留局部主题、Modal 及全屏作用域。",
};

export default revision;
