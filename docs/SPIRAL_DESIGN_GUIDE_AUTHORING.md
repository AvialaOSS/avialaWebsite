# Spiral Design & Usage Guide — Authoring for Designers

Chinese: [SPIRAL_DESIGN_GUIDE_AUTHORING.zh_cn.md](./SPIRAL_DESIGN_GUIDE_AUTHORING.zh_cn.md)

This guide explains how to write the **Design & usage** tab (`设计与使用指南`) on Spiral component docs. You author structured blocks in a **versionless** TypeScript file per component; engineers wire the page `scope`. You do **not** use knobs or the Monaco code editor in this tab. Design guides do **not** follow docs / Spiral semver.

## Where it lives

| Item | Path |
|------|------|
| Content | `apps/spiral-docs/src/doc-revisions/{Component}/design-guide.ts` |
| Sample | `apps/spiral-docs/src/doc-revisions/FormField/design-guide.ts` |
| Preview | Component page → **Design & usage** (`?guide=design`) |

Set `status` to `"published"` when ready. Use `"draft"` (or omit the file) to keep the empty “coming soon” state.

## What this tab is for

- When to use the component, and how it should look in product
- Fixed, designer-chosen API and layout (centered stage, captions, do/don’t)
- Side-by-side demos and demo + copy layouts

**Not** for: prop tables, knobs, editable live code (those belong to **Developer guide**).

## Block types

### `prose`

Chinese (or bilingual) explanatory text. Stored as **GitHub-flavored Markdown** (headings, lists, bold, links, inline/fenced code, tables). The public tab renders it; the layout editor is WYSIWYG — select text for a floating format bar (headline / bold / italic / underline / code / link). `# ` / `- ` / `**bold**` shortcuts still work.

```ts
{
  type: "prose",
  text: "用于成组标签与校验。\n\n- 标签说明字段\n- **错误**与控件描边成对出现",
}
```

### `demo`

A **preview-only** live stage (interactive Spiral components, no knobs, no code editor).

| Field | Required | Meaning |
|-------|----------|---------|
| `code` | yes | Source that calls `render(<… />)`. Components must already be in the page `scope` (ask an engineer if a symbol is missing). |
| `caption` | no | Label **under** the stage |
| `align` | no | Content placement inside the stage: `"start"` \| `"center"` (default) \| `"end"` |
| `verdict` | no | Do/don’t icon **inside** the stage, bottom inset: `"good"` \| `"bad"` |
| `height` | no | Fixed stage height in CSS pixels (layout editor drag / input). Omit for content-driven height. |

```ts
{
  type: "demo",
  code: `render(
  <FormField label="Email" className="max-w-sm">
    <Input placeholder="you@aviala.top" />
  </FormField>
);`,
  caption: "Normal entry",
  align: "center",
  verdict: "good",
}
```

**Caption vs verdict**

- **caption** — names the example (outside the frame)
- **verdict** — marks recommended (`good`) vs discouraged (`bad`) usage (icon at the bottom inside the frame, with padding)

### Numbered markers (optional)

Pin circular black/white numbers onto live preview DOM nodes, and sync a numbered list into a chosen `prose` block.

| Field | Meaning |
|-------|---------|
| `markers` | `{ id, selector, note, anchor?, margin?, offsetX?, offsetY?, line? }[]` — order is display number `1…n`; `selector` is relative to the preview root |
| `markersProse` | `{ blockIndex, columnIndex? }` — prose that receives the managed list |

Managed fence inside that prose (other copy is preserved; **hidden in the layout editor textarea**, shown as the styled numbered list):

```text
<<<design-markers
1. Label explains the field
2. Error tip pairs with the control border
>>>
```

**In the layout editor:** open **代码** → toggle **标注** on the preview → click elements → edit notes / sync prose in the panel. Hover a badge to set **anchor**, **margin**, offsets, and **连接线**.

### `row`

Equal-width columns. Each column is a `demo` or `prose`. On narrow screens, columns stack vertically.

```ts
{
  type: "row",
  columns: [
    { type: "demo", code: `render(…)`, caption: "Do", verdict: "good" },
    { type: "demo", code: `render(…)`, caption: "Don’t", verdict: "bad" },
  ],
}
```

Layouts you can compose:

1. Several demos side by side  
2. Demo + prose side by side  
3. Single full-width `demo` (or a one-column `row`)

## Minimal template

```ts
import type { DesignGuideDoc } from "../types";

const designGuide: DesignGuideDoc = {
  status: "published",
  blocks: [
    { type: "prose", text: "When to use…" },
    {
      type: "row",
      columns: [
        {
          type: "demo",
          code: `render(/* recommended */);`,
          caption: "Recommended",
          align: "center",
          verdict: "good",
        },
        {
          type: "demo",
          code: `render(/* avoid */);`,
          caption: "Avoid",
          align: "center",
          verdict: "bad",
        },
      ],
    },
  ],
};

export default designGuide;
```

## Layout editor (local)

Standalone app (`apps/design-guide-editor`, port **5176**) writes `{Component}/design-guide.ts` through a **Vite dev API** that targets the monorepo path `apps/spiral-docs/src/doc-revisions` (no folder picker).

1. Run docs preview: `npm run dev:spiral-docs` or `dev:spiral-docs:local`
2. Run the editor: `npm run dev:design-guide-editor` or `dev:design-guide-editor:local` → http://localhost:5176/
3. On a component page → **Design & usage** → **编辑布局** (DEV only) opens the editor with `?component=…` (no version)
4. Edit blocks → **保存到本地** writes the `.ts` file; docs Vite HMR refreshes the preview
5. Optional: in **代码** modal, use **标注** on the preview (hover badge for align / margin / leader line)
6. **复制 TS** remains as a fallback export

Production builds do not expose the edit button.

## Writing tips

- Prefer short scenarios over long essays; one idea per section
- Pair `good` / `bad` when contrasting correct vs incorrect usage
- Keep `code` self-contained; don’t rely on knobs
- Put prop names and enum values in English inside Chinese sentences if you write CN copy
- Ask an engineer before adding new imports to `code` — they must export them in the DocPage `scope`

## Checklist before publish

1. `status: "published"`
2. Preview at `?guide=design` — no empty state
3. Captions readable; verdict icons not covering the control
4. Do/don’t pairs use matching captions
5. Engineer confirms `scope` covers every component used in `code`

## Related

- Agent skill (repo): `.cursor/skills/spiral-docs-writing/SKILL.md`
- Deploy / versions: [GITHUB_DEPLOY.md](./GITHUB_DEPLOY.md)
