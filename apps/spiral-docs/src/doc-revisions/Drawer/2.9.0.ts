import type { ComponentDocRevision } from "../types";
import {
  buildDrawerCode,
  drawerKnobs,
  drawerLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.9.0",
  title: "Drawer 抽屉",
  description: "用于从屏幕边缘滑出的侧栏面板，承载详情、表单或辅助操作。",
  prose:
    "适合详情查看、筛选配置、多步表单等需要较大内容区且不必居中打断的场景。可用 `position` 选择从左、右、上、下滑入；结构与 Modal 类似，含页头、内容区与操作区。",
  liveCode: drawerLiveCode,
  knobs: drawerKnobs,
  buildCode: buildDrawerCode,
};

export default revision;
