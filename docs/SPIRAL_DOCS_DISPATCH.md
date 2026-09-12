# Cross-repo docs scaffold (Spiral → avialaWebsite)

中文版：[SPIRAL_DOCS_DISPATCH.zh_cn.md](./SPIRAL_DOCS_DISPATCH.zh_cn.md)

After `@aviala-design/spiral` publishes, Spiral dispatches `spiral-released` to
this repo. Workflow `.github/workflows/scaffold-spiral-docs.yml` scaffolds a
draft docs version, bumps `@aviala-design/*` workspace deps + lockfile, opens a
PR, and posts the coverage **checklist as a bot comment**.

## Credentials (GitHub App on Spiral)

Configure these on the **Spiral** repository (not avialaWebsite):

| Name | Type | Where |
|------|------|--------|
| `AVIALA_WEBSITE_APP_CLIENT_ID` | Repository **variable** | [Spiral → Settings → Variables → Actions](https://github.com/AvialaOSS/developer-kit/settings/variables/actions) |
| `AVIALA_WEBSITE_APP_PRIVATE_KEY` | Repository **secret** | [Spiral → Settings → Secrets → Actions](https://github.com/AvialaOSS/developer-kit/settings/secrets/actions) |

### Create and install the App

1. GitHub (AvialaOSS) → **Settings → Developer settings → GitHub Apps → New GitHub App**
2. Suggested name: `Aviala Spiral Docs Dispatch`
3. **Webhook**: disable Active (API-only)
4. **Repository permissions** → **Contents**: Read and write (`repository_dispatch`)
5. **Where can this app be installed?** → Only on this account
6. After create: copy **Client ID** → Spiral variable `AVIALA_WEBSITE_APP_CLIENT_ID`
7. **Generate a private key** → paste the `.pem` into Spiral secret `AVIALA_WEBSITE_APP_PRIVATE_KEY`
8. **Install App** → AvialaOSS → **Only select repositories** → **`avialaWebsite` only**

You do **not** need:

- `NPM_TOKEN` (OIDC trusted publishing)
- Extra secrets on avialaWebsite (PR + comment use the workflow `GITHUB_TOKEN`)
- The App installed on Spiral itself
- Legacy `AVIALA_WEBSITE_TOKEN` PAT (delete after App dispatch works)

### Optional later: GitHub App for org reuse

Same App can stay; only rotate the private key when needed.

## What the scaffold PR includes

- `apps/spiral-docs/src/versions/manifest.json` draft entry
- `doc-revisions/{Name}/{version}.ts` stubs for changed components: prefer `import previous from "./{prevRev}"` and append a short note from `component-changelogs.json` (Added/Changed/Fixed/…); still requires human review before `ready`
- `apps/spiral-docs/package.json`, `apps/colorcat/package.json`, `package-lock.json` pinned to the published spiral / tokens / icons versions
- PR body: summary only
- Bot PR comment (`<!-- spiral-docs-scaffold-checklist -->`): human checklist

## Manual test

On avialaWebsite → Actions → **Scaffold Spiral docs version** → Run workflow → enter a version (e.g. `2.3.1`).

Or from a machine with `gh` auth that can write avialaWebsite:

```bash
gh api repos/AvialaOSS/avialaWebsite/dispatches \
  -f event_type='spiral-released' \
  -f 'client_payload[spiral_version]=2.3.1'
```

## Notes

- Until `@aviala-design/spiral` ships `component-changelogs.json` on npm, the scaffold may create a draft with **no** changed-component stubs (empty changelog download). After the next Spiral release that includes the export, stubs will populate automatically.
- If App credentials are missing on Spiral, npm publish still succeeds; Release logs a warning and skips dispatch.
