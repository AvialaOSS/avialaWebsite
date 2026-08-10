import previous from "./2.0.0";
import type { ComponentDocRevision } from "../types";

/** Scaffolded from 2.0.0 + component changelog. Review before marking ready. */
const revision: ComponentDocRevision = {
  ...previous,
  revision: "2.6.1",
  prose: previous.prose + " 2.6.1：日历面板上一月 / 下一月导航图标改为 `direction/arrowLeftLight` 与 `direction/arrowRightLight`；导航箭头按压缩小，松开后沿翻页方向飞出并由对侧飞入；月/年与时间滚轮：鼠标滚轮步进更灵敏，可一次跨多格，并允许打断进行中的平滑滚动；loop 滚轮按当前位置最短路径滚动，跨 0/末项不再整段甩回；选中字色经固定高亮框裁切随列表滚动，停稳后对准居中。",
};

export default revision;
