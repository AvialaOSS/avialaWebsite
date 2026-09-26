import previous from "./2.9.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：进度条端点圆角接入组件 Token，大尺寸区分起点与滑块端，并适配范围、纵向、RTL 和 inverted；普通/禁用轨道、进度、滑块和标记颜色，以及标记独立宽高、圆角和两层阴影参数接入组件 Token；两档轨道厚度、滑块独立宽高及轨道/滑块圆角接入组件 Token，覆盖横纵方向并保留显式旧尺寸覆盖；禁用 Slider 的隐藏输入不再参与原生表单提交，单值与范围滑块均生效。",
};

export default revision;
