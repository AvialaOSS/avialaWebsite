import previous from "./3.0.0";
import type { ComponentDocRevision } from "../types";
import { cardKnobs, buildCardCode } from "../../demos/component-demos";
import { defaultKnobValues } from "../../components/DemoKnobs";

const revision: ComponentDocRevision = {
  ...previous,
  revision: "3.1.0",
  liveCode: buildCardCode(defaultKnobValues(cardKnobs)).replace(
    "<CardHead",
    '<CardHead heading="独立标题"',
  ),
  knobs: [
    ...cardKnobs,
    {
      kind: "string",
      name: "heading",
      label: "heading",
      defaultValue: "独立标题",
    },
  ],
  buildCode: (values) =>
    buildCardCode(values).replace(
      "<CardHead",
      `<CardHead heading={${JSON.stringify(String(values.heading ?? ""))}}`,
    ),
  prose:
    "CardHead 和 CardBottom 新增可选 heading 标题行，保留 title 与 description。heading 使用独立颜色 Token；省略 heading 时不产生空行。actionLabel 未传且没有 action 时不显示操作按钮。Web heading 已实现，Figma 标题层仍因缺少 OPPO Sans 4.0 SemiBold 未同步。",
};

export default revision;
