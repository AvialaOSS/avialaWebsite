# Cross-repo docs scaffold (Spiral2 → avialaWebsite)

中文版：[SPIRAL_DOCS_DISPATCH.zh_cn.md](./SPIRAL_DOCS_DISPATCH.zh_cn.md)

After `@aviala-design/spiral` publishes, Spiral2 dispatches `spiral-released` to
this repo. Workflow `.github/workflows/scaffold-spiral-docs.yml` scaffolds a
draft docs version + opens a PR.

## Token you need to create

**One secret, on the Spiral2 repository** (not on avialaWebsite):

| Secret name | Where |
|-------------|--------|
| `AVIALA_WEBSITE_TOKEN` | [Spiral2 → Settings → Secrets → Actions](https://github.com/AvialaOSS/spiral-2/settings/secrets/actions) |

### Recommended: fine-grained personal access token

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate**
2. **Resource owner**: `AvialaOSS` (or the org that owns avialaWebsite)
3. **Repository access**: Only select **`avialaWebsite`**
4. **Permissions** → Repository permissions:
   - **Contents**: Read and write *(required for `repository_dispatch`)*
5. Generate and copy the token into Spiral2 secret `AVIALA_WEBSITE_TOKEN`

You do **not** need:

- `NPM_TOKEN` (already using OIDC trusted publishing)
- Extra secrets on avialaWebsite (PR uses the workflow’s built-in `GITHUB_TOKEN`)
- A token with access to Spiral2 itself for this flow

### Alternative: classic PAT

Classic token with `repo` scope also works, but is broader. Prefer fine-grained.

### Optional later: GitHub App

A GitHub App installed on `avialaWebsite` with Contents R/W can replace the PAT;
wire `actions/create-github-app-token` in Spiral2’s dispatch step if you go that route.

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
- If `AVIALA_WEBSITE_TOKEN` is missing, publish still succeeds; Spiral2 logs a warning and skips dispatch.
