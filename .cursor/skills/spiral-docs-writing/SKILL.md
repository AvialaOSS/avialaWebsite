---
name: spiral-docs-writing
description: >-
  Writes Aviala Spiral docs site content in apps/spiral-docs: Chinese prose in
  doc-revisions, demos when needed, and manifest ready/default workflow after
  scaffold. Use when editing spiral-docs, doc-revisions, component demos,
  versions/manifest.json, docs coverage checklist, or Chinese docs copy.
---

# Spiral Docs Writing (avialaWebsite)

## Scope

Public docs live in `apps/spiral-docs/`. They consume **published** `@aviala-design/*` on production; local unpublished Spiral uses `spiral-docs-local`.

## Prose tone (Chinese)

- Fields: `title`, `description`, `prose` in `src/doc-revisions/{Component}/{rev}.ts`
- Short product tone: when to use the component, typical scenarios — not implementation diaries
- Keep API names, props, and enum values in English inside Chinese sentences

## After a Spiral release (scaffold)

Manifest path: `apps/spiral-docs/src/versions/manifest.json`.

1. Prefer scaffolded stubs: `import previous from "./{prevRev}"` plus changelog appendix — **edit**, do not blank-rewrite.
2. Manifest entry stays `status: "draft"` until reviewed.
3. Checklist (bot PR comment): update revisions/demos → set `status` to `ready` → point `default` to the new version → confirm stale banner clears (npm latest vs docs `default`).
4. Unchanged components should `inherits` the previous covered version (or omit and inherit from the previous covered docs version).
5. Bump of workspace deps + lockfile (`apps/spiral-docs`, `apps/colorcat`, root lockfile) is part of the scaffold PR when the workflow is up to date.

Canonical: `docs/SPIRAL_DOCS_DISPATCH.zh_cn.md` (EN: `docs/SPIRAL_DOCS_DISPATCH.md`). Deploy notes: `docs/GITHUB_DEPLOY.md`.

## Demos

- Update `liveCode` / `knobs` / `buildCode` only when API or UX needs a new live example.
- Shared builders live in `src/demos/component-demos.ts`.

## Commits

- English subjects: `docs(spiral): …`
- Do not invent Chinese commit subjects unless asked.
