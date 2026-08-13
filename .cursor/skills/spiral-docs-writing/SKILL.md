---
name: spiral-docs-writing
description: >-
  Writes Aviala Spiral docs site content in apps/spiral-docs: Chinese prose in
  doc-revisions, demos when needed, design-guide blocks, and manifest
  ready/default workflow after scaffold. Use when editing spiral-docs,
  doc-revisions, component demos, designGuide, versions/manifest.json, docs
  coverage checklist, or Chinese docs copy.
---

# Spiral Docs Writing (avialaWebsite)

## Scope

Public docs live in `apps/spiral-docs/`. They consume **published** `@aviala-design/*` on production; local unpublished Spiral uses `spiral-docs-local`.

## Prose tone (Chinese)

- Fields: `title`, `description`, `prose` in `src/doc-revisions/{Component}/{rev}.ts`
- Short product tone: when to use the component, typical scenarios — not implementation diaries
- Keep API names, props, and enum values in English inside Chinese sentences

## Dev guide vs design guide

| Tab | Audience | Content |
|-----|----------|---------|
| **开发指南** | Engineers | `liveCode` + knobs + API tables; editable Monaco |
| **设计与使用指南** | Designers / PMs | Structured `designGuide.blocks`; preview-only demos |

Do **not** put knobs or Monaco in the design guide. Designer-chosen API and placement live in fixed `code` strings.

## Design guide (`design-guide.ts`, versionless)

**Not** in semver revision files. One file per component:

`src/doc-revisions/{Component}/design-guide.ts`

Independent of manifest `rev` / docs version switcher.

```ts
import type { DesignGuideDoc } from "../types";

const designGuide: DesignGuideDoc = {
  status: "published", // or "draft" → empty state
  blocks: [
    { type: "prose", text: "何时使用…\n\n第二段。" },
    {
      type: "row",
      columns: [
        {
          type: "demo",
          code: `render(<Button mode="primary">保存</Button>)`,
          caption: "主操作",
          align: "center", // start | center | end
          verdict: "good", // good | bad — icon inside stage, bottom inset
        },
        { type: "prose", text: "说明…" },
      ],
    },
  ],
};

export default designGuide;
```

### Block types

- `prose` — Chinese copy stored as GFM Markdown; public tab renders it, layout editor is WYSIWYG; may contain a managed `<<<design-markers` fence
- `demo` — preview-only live eval (`render(...)` + page `scope`); optional `caption`, `align`, `verdict`, `height`, `markers`, `markersProse`
- `row` — equal columns of `demo` | `prose`; stacks on narrow screens

### Numbered markers

- In editor **代码** modal: **标注** on preview → click DOM → `markers: { id, selector, note, anchor?, margin?, offsetX?, offsetY?, line? }[]`
- Hover badge to adjust anchor / margin / offsets / leader line
- `markersProse: { blockIndex, columnIndex? }` syncs a numbered list fence into that prose
- Hover list digit ↔ demo badge highlight (black circle, white number)

Legacy `prose?: string` on `designGuide` still works if `blocks` is omitted.

### Caption vs verdict

- **caption** — label under the stage (what this example is)
- **verdict** — do/don't mark **inside** the stage bottom (`good` / `bad`); use for pairwise contrasts

### Writing tips

- Prefer short scenarios + 1–2 row layouts over long essays
- Pair `verdict: "good"` / `"bad"` when showing correct vs incorrect usage
- Keep `code` self-contained; rely on the DocPage `scope` for component imports

### Layout editor (local DEV)

Standalone app `apps/design-guide-editor` (port **5176**). Run alongside docs; design tab **编辑布局** opens `?component=…` (no version). Saves via Vite API into `{Component}/design-guide.ts`. Toolbar **草稿 / 已发布** writes `status` (`draft` → docs empty state). Annotate mode + prose sync for numbered callouts. See `docs/SPIRAL_DESIGN_GUIDE_AUTHORING.md`.

Reference sample: `src/doc-revisions/FormField/design-guide.ts`.

Designer-facing guide (bilingual):

- EN: `docs/SPIRAL_DESIGN_GUIDE_AUTHORING.md`
- ZH: `docs/SPIRAL_DESIGN_GUIDE_AUTHORING.zh_cn.md`

## After a Spiral release (scaffold)

1. Prefer scaffolded stubs: `import previous from "./{prevRev}"` plus changelog appendix — **edit**, do not blank-rewrite.
2. Manifest entry stays `status: "draft"` until reviewed.
3. Checklist (bot PR comment): update revisions/demos → set `status` to `ready` → point `default` to the new version → confirm stale banner clears.
4. Unchanged components should `inherits` the previous covered version.
5. Bump of workspace deps + lockfile is part of the scaffold PR when the workflow is up to date.

Canonical: `docs/SPIRAL_DOCS_DISPATCH.zh_cn.md` (EN: `docs/SPIRAL_DOCS_DISPATCH.md`). Deploy notes: `docs/GITHUB_DEPLOY.md`.

## Demos (dev guide)

- Update `liveCode` / `knobs` / `buildCode` only when API or UX needs a new live example.
- Shared builders live in `src/demos/component-demos.ts`.

## Commits

- English subjects: `docs(spiral): …`
- Do not invent Chinese commit subjects unless asked.
