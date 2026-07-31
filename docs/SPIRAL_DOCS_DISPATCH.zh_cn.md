# 跨仓文档脚手架（Spiral2 → avialaWebsite）

`@aviala-design/spiral` 发布到 npm 后，Spiral2 会向本仓库派发 `spiral-released` 事件。工作流 [`.github/workflows/scaffold-spiral-docs.yml`](../.github/workflows/scaffold-spiral-docs.yml) 会 scaffold 一档草稿文档版本并自动开 PR。

英文版：[SPIRAL_DOCS_DISPATCH.md](./SPIRAL_DOCS_DISPATCH.md)

## 需要创建的 Token

**只需一个 Secret，配在 Spiral2 仓库**（不是 avialaWebsite）：

| Secret 名称 | 配置位置 |
|-------------|----------|
| `AVIALA_WEBSITE_TOKEN` | [Spiral2 → Settings → Secrets → Actions](https://github.com/AvialaOSS/spiral-2/settings/secrets/actions) |

### 推荐：Fine-grained PAT（细粒度个人访问令牌）

1. GitHub → **Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate**
2. **Resource owner**：`AvialaOSS`（或拥有 avialaWebsite 的组织）
3. **Repository access**：只勾选 **`avialaWebsite`**
4. **Permissions** → Repository permissions：
   - **Contents**：Read and write（`repository_dispatch` 需要）
5. 生成后，把 token 填进 Spiral2 的 Secret `AVIALA_WEBSITE_TOKEN`

**不需要：**

- `NPM_TOKEN`（已用 OIDC Trusted Publishing）
- 在 avialaWebsite 上再配额外 Secret（开 PR 用工作流自带的 `GITHUB_TOKEN`）
- 本流程不要求 token 能写 Spiral2 本身

### 备选：Classic PAT

带 `repo` 权限的 Classic token 也可以，但范围更大。优先用细粒度令牌。

### 可选后续：GitHub App

在 `avialaWebsite` 安装具备 Contents 读写权限的 GitHub App，可替代 PAT；届时在 Spiral2 的 dispatch 步骤用 `actions/create-github-app-token` 即可。

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
- 若未配置 `AVIALA_WEBSITE_TOKEN`，npm 发布仍会成功；Spiral2 会打 warning 并跳过 dispatch。
