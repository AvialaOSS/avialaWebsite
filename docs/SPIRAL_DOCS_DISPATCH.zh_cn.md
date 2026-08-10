# 跨仓文档脚手架（Spiral2 → avialaWebsite）

`@aviala-design/spiral` 发布到 npm 后，Spiral2 会向本仓库派发 `spiral-released` 事件。工作流 [`.github/workflows/scaffold-spiral-docs.yml`](../.github/workflows/scaffold-spiral-docs.yml) 会 scaffold 一档草稿文档版本、bump `@aviala-design/*` 依赖与 lockfile、自动开 PR，并把覆盖 checklist 以 **bot comment** 贴在 PR 上。

英文版：[SPIRAL_DOCS_DISPATCH.md](./SPIRAL_DOCS_DISPATCH.md)

## 需要配置的凭证（GitHub App，配在 Spiral2）

| 名称 | 类型 | 配置位置 |
|------|------|----------|
| `AVIALA_WEBSITE_APP_CLIENT_ID` | Repository **variable** | [Spiral2 → Settings → Variables → Actions](https://github.com/AvialaOSS/spiral-2/settings/variables/actions) |
| `AVIALA_WEBSITE_APP_PRIVATE_KEY` | Repository **secret** | [Spiral2 → Settings → Secrets → Actions](https://github.com/AvialaOSS/spiral-2/settings/secrets/actions) |

### 创建并安装 App

1. GitHub（AvialaOSS）→ **Settings → Developer settings → GitHub Apps → New GitHub App**
2. 名称建议：`Aviala Spiral Docs Dispatch`
3. **Webhook**：关闭 Active（只发 API）
4. **Repository permissions** → **Contents**：Read and write（`repository_dispatch` 需要）
5. **Where can this app be installed?** → Only on this account
6. 创建后复制 **Client ID** → 填进 Spiral2 的 variable `AVIALA_WEBSITE_APP_CLIENT_ID`
7. **Generate a private key** → 把 `.pem` 全文填进 Spiral2 的 secret `AVIALA_WEBSITE_APP_PRIVATE_KEY`
8. **Install App** → 选 AvialaOSS → **Only select repositories** → 只勾 **`avialaWebsite`**

**不需要：**

- `NPM_TOKEN`（已用 OIDC Trusted Publishing）
- 在 avialaWebsite 上再配额外 Secret（开 PR / 评论用工作流自带的 `GITHUB_TOKEN`）
- 把 App 装到 Spiral2 本身
- 旧的 `AVIALA_WEBSITE_TOKEN` PAT（App 跑通后可删除）

## Scaffold PR 包含什么

- `apps/spiral-docs/src/versions/manifest.json` 草稿条目
- 变更组件的 `doc-revisions/{Name}/{version}.ts` stub：优先 `import previous from "./{上一版}"`，并追加本版 `component-changelogs.json`（Added/Changed/Fixed…）摘要；仍须人工审后再标 `ready`
- `apps/spiral-docs/package.json`、`apps/colorcat/package.json`、`package-lock.json`（钉到本次发布的 spiral / tokens / icons）
- PR 正文：摘要
- Bot 评论（含 `<!-- spiral-docs-scaffold-checklist -->`）：人工 checklist

## 手动测试

在 avialaWebsite → Actions → **Scaffold Spiral docs version** → Run workflow → 填入版本号（如 `2.3.1`）。

或在本机用有权写 avialaWebsite 的 `gh`：

```bash
gh api repos/AvialaOSS/avialaWebsite/dispatches \
  -f event_type='spiral-released' \
  -f 'client_payload[spiral_version]=2.3.1'
```

## 说明

- 在 `@aviala-design/spiral` 把 `component-changelogs.json` 发到 npm 之前，scaffold 可能生成**没有**变更组件 stub 的草稿（changelog 下载为空）。包含该导出的下一次 Spiral 发版后，stub 会自动填上。
- 若 Spiral2 未配置 App 凭证，npm 发布仍会成功；Release 会打 warning 并跳过 dispatch。
