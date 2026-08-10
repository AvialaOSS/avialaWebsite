---
name: spiral-docs-local
description: >-
  Local debugging of Spiral docs against a sibling Spiral2 checkout using
  DOCS_SPIRAL_LOCAL, tokens vite-plugin zero-build CSS, and icons src.
  Use when running dev:spiral-docs:local, dev:site:local, setting
  DOCS_SPIRAL_ROOT / DOCS_SPIRAL_LOCAL_DIST, or debugging unpublished Spiral in docs.
---

# Spiral Docs Local Debug (avialaWebsite)

## Which mode

| Goal | Command |
|------|---------|
| What users install (npm lockfile) | `npm run dev:spiral-docs` / `dev:site` |
| Unpublished Spiral2 source | `npm run dev:spiral-docs:local` / `dev:site:local` |

Default sibling path: `../Spiral2`. Override with `DOCS_SPIRAL_ROOT`.

## Zero-build local (default)

`with-local-spiral.mjs` sets `DOCS_SPIRAL_LOCAL=1` and **preflights** before Vite:

- Spiral2 checkout + `packages/{ui,tokens,icons}` present
- Tokens CSS via Spiral2 `packages/tokens/vite-plugin.mjs` (same as playground) — **no** `tokens build` required
- Icons prefer `packages/icons/src`; only if src/dist missing → in Spiral2 run `pnpm --filter @aviala-design/icons build` (or `icons:sync` after Figma)

Vite wires this in `apps/spiral-docs/vite.config.ts` (`aviala-tokens-css` + `docs-local-spiral-resolve`).

## Dist mode

Set `DOCS_SPIRAL_LOCAL_DIST=1` only to validate publish-shaped `packages/*/dist`. Then Spiral2 must have built spiral / tokens / icons dists.

## Fail-fast

If preflight fails, fix the printed path/command — do not ignore and debug half-broken CSS/icons.

## Docs

Local preview and troubleshooting: `docs/GITHUB_DEPLOY.md` § 本地预览 / 故障排查.

For writing revisions / ready checklist after publish, use skill `spiral-docs-writing`.
