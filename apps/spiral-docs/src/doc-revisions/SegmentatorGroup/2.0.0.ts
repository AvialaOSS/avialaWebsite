import type { ComponentDocRevision } from "../types";

const revision: ComponentDocRevision = {
  revision: "2.0.0",
  title: "Segmentator 分段器",
  description: "在互斥选项间切换，带滑动指示器动画。",
  prose:
    `支持 nested / tiled 模式与 allRound。开启 equalWidth 时分组占满容器宽度，各选项均分宽度。移动端横向拖拽会在松手后吸附到最近选项，并提供按压反馈。编辑器内可编写含 useState 的示例代码。`,
};

export default revision;
