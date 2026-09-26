import previous from "./2.7.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：普通态和失败态环形轨道、进度路径宽高与描边接入 Token，支持非正方形覆盖；旧尺寸覆盖继续按比例缩放描边；条形轨道高度、圆角、间距与文本色接入组件 Token；环形容器尺寸和不同状态的轨道/进度颜色跟随标准项目；保留显式旧 CSS 变量覆盖，移除会遮蔽组件 Token 的默认值；大环形尺寸也支持继承旧覆盖；长标签在受限宽度内省略显示并提供完整文本提示，避免将条形轨道挤至零；组件不再超出窄父容器；环形进度为 0 时隐藏进度路径，避免圆头残留一个小圆点。",
};

export default revision;
