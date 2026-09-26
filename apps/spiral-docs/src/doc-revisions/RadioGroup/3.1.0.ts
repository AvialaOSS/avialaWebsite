import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  prose:
    previous.prose +
    " 3.1.0：整组禁用时，RadioInput 的文字、图标、卡片选中边框和鼠标提示同步进入禁用态，无需逐项重复传入 disabled；禁用卡片不触发悬浮或按压背景；Radio 背景、边框、圆点、高光和阴影颜色，以及输入文字/说明、禁用透明度和卡片边框接入组件 Token；四状态按 Figma 分别渲染：选中禁用态更换背景并移除阴影，未选中态保留16px内圆，禁用时仅内圆半透明；移除旧整组件透明度叠乘；Radio 外框尺寸、圆角与两态内边距消费组件 Token，保留旧尺寸覆盖；普通与卡片 RadioInput 的间距分别消费组件 Token；卡片 x/y 内边距、圆角及图标高度可独立覆盖；直接包含卡片输入项的纯卡片组消费横纵方向独立间距；普通或混合组继续使用普通组间距。",
};

export default revision;
