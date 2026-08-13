# Spiral 设计与使用指南 — 设计师书写说明

English: [SPIRAL_DESIGN_GUIDE_AUTHORING.md](./SPIRAL_DESIGN_GUIDE_AUTHORING.md)

本文说明如何编写组件文档里的 **设计与使用指南** 页签。内容写在**无版本**的 TypeScript 文件里（每个组件一份）；工程师负责页面 `scope`。本页签**没有** knobs，也**没有** Monaco 代码编辑器。设计指南**不跟** docs / Spiral semver。

## 写在哪里

| 项 | 路径 |
|----|------|
| 正文 | `apps/spiral-docs/src/doc-revisions/{组件名}/design-guide.ts` |
| 范例 | `apps/spiral-docs/src/doc-revisions/FormField/design-guide.ts` |
| 预览 | 组件页 → **设计与使用指南**（`?guide=design`） |

定稿后将 `status` 设为 `"published"`。使用 `"draft"` 或不写文件时，页面显示「敬请期待」空态。

## 这个页签做什么

- 讲清何时使用、产品里应长什么样
- 由设计先定好的 API 与摆放（居中舞台、Caption、对/错标）
- 多 Demo 并排、Demo 与文字并排

**不要**写：API 表、knobs、可编辑代码（那些属于 **开发指南**）。

## Block 类型

### `prose`

说明文案，文件里仍是 **GitHub Flavored Markdown**（标题、列表、加粗、链接、行内/代码块、表格）。公开页按 Markdown 渲染；布局编辑器是所见即所得——**选中文字**会浮出格式条（标题层级 / 加粗 / 斜体 / 下划线 / 代码 / 链接），`# ` / `- ` / `**加粗**` 快捷输入仍可用。

```ts
{
  type: "prose",
  text: "用于成组标签与校验。\n\n- 标签说明字段\n- **错误**与控件描边成对出现",
}
```

### `demo`

**仅预览**的 Live 舞台（组件可交互；无 knobs、无代码编辑器）。

| 字段 | 必填 | 含义 |
|------|------|------|
| `code` | 是 | 调用 `render(<… />)` 的源码。组件须已在页面 `scope` 中（缺符号时找工程师加） |
| `caption` | 否 | 舞台**外侧下方**的标注 |
| `align` | 否 | 舞台内摆放：`"start"` \| `"center"`（默认）\| `"end"` |
| `verdict` | 否 | 舞台**内侧靠底**的对/错图标：`"good"` \| `"bad"`（保留底部 padding） |
| `height` | 否 | 舞台固定高度（CSS 像素；布局编辑器拖拽 / 输入）。省略则随内容撑开 |

```ts
{
  type: "demo",
  code: `render(
  <FormField label="邮箱" className="max-w-sm">
    <Input placeholder="you@aviala.top" />
  </FormField>
);`,
  caption: "正常录入",
  align: "center",
  verdict: "good",
}
```

**Caption 与 verdict**

- **caption** — 给示例起名（在框外）
- **verdict** — 标记推荐（`good`）或避免（`bad`）（框内底部图标）

### 序号标注（可选）

在 Live 预览的真实 DOM 上挂黑底白字圆形序号，并把编号列表同步到指定的 `prose` 块。

| 字段 | 含义 |
|------|------|
| `markers` | `{ id, selector, note, anchor?, margin?, offsetX?, offsetY?, line? }[]` — 数组顺序即显示序号；`selector` 相对预览根节点 |
| `markersProse` | `{ blockIndex, columnIndex? }` — 接收受管列表的文字块 |

目标 prose 内受管围栏（围栏外手写内容保留；**布局编辑器文本框里不显示围栏**，只显示下方样式化序号列表）：

```text
<<<design-markers
1. 标签说明字段含义
2. 错误 tip 与描边联动
>>>
```

**布局编辑器：** 打开 **代码** → 预览区开 **标注** → 点击元素挂序号 → 面板改说明 / 同步文字。悬浮角标可调 **对齐、边距、偏移、连接线**。

### `row`

等宽多列。每列是 `demo` 或 `prose`。窄屏会纵向堆叠。

```ts
{
  type: "row",
  columns: [
    { type: "demo", code: `render(…)`, caption: "推荐", verdict: "good" },
    { type: "demo", code: `render(…)`, caption: "避免", verdict: "bad" },
  ],
}
```

可组合布局：

1. 多个 Demo 并排  
2. Demo 与文字并排  
3. 单个通栏 `demo`（或单列 `row`）

## 最小模板

```ts
import type { DesignGuideDoc } from "../types";

const designGuide: DesignGuideDoc = {
  status: "published",
  blocks: [
    { type: "prose", text: "何时使用…" },
    {
      type: "row",
      columns: [
        {
          type: "demo",
          code: `render(/* 推荐写法 */);`,
          caption: "推荐",
          align: "center",
          verdict: "good",
        },
        {
          type: "demo",
          code: `render(/* 避免写法 */);`,
          caption: "避免",
          align: "center",
          verdict: "bad",
        },
      ],
    },
  ],
};

export default designGuide;
```

## 布局编辑器（本地）

独立 App（`apps/design-guide-editor`，端口 **5176**）通过 Vite 开发接口读写 `{组件名}/design-guide.ts`（**无需**选手动文件夹）。

1. 开 docs 预览：`npm run dev:spiral-docs` 或 `dev:spiral-docs:local`
2. 开编辑器：`npm run dev:design-guide-editor` 或 `dev:design-guide-editor:local` → http://localhost:5176/
3. 组件页 → **设计与使用指南** → **编辑布局**（仅 DEV）会带上 `?component=…` 打开编辑器（无版本）
4. 页内改块 → **保存到本地** 写回 `.ts`；docs 的 Vite HMR 会刷新预览
5. 可选：在 **代码** 弹窗里用预览 **标注**（悬浮角标可调对齐 / 边距 / 连接线）
6. **复制 TS** 仅作兜底导出

生产构建不展示编辑入口。

## 写作建议

- 短场景、少长文；一节只讲一件事
- 正误对比用成对的 `good` / `bad`
- `code` 自包含，不依赖 knobs
- 中文句子里 API 名、枚举值保持英文
- 新增 `code` 里用到的组件前先和工程师确认 `scope`

## 发布前检查

1. `status: "published"`
2. 在 `?guide=design` 预览，不是空态
3. Caption 可读；verdict 图标不挡住控件
4. 对/错成对时 Caption 语义对应
5. 工程师确认 `scope` 覆盖 `code` 里所有组件

## 相关链接

- Agent skill：`.cursor/skills/spiral-docs-writing/SKILL.md`
- 部署 / 版本：[GITHUB_DEPLOY.md](./GITHUB_DEPLOY.md)
