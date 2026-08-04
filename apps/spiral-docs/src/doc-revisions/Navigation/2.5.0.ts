import type { ComponentDocRevision } from "../types";
import {
  buildNavigationCode,
  navigationKnobs,
  navigationLiveCode,
} from "../../demos/component-demos";

const revision: ComponentDocRevision = {
  revision: "2.5.0",
  title: "Navigation 导航",
  description: "用于承载应用的主导航结构。",
  prose:
    "适合侧边栏、顶栏等需要在多个页面或模块间切换的场景。2.5.0 将激活指示条与展开 / 收拢动效改为更干脆的 ease-out（`--navigation-transition-easing`）。",
  liveCode: navigationLiveCode,
  knobs: navigationKnobs,
  buildCode: buildNavigationCode,
};

export default revision;
