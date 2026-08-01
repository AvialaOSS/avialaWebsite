# GitHub Pages 部署指南

本站通过 **GitHub Actions** 构建 Hugo，并发布到 **GitHub Pages**（正式域名：`https://www.aviala.top/`）。

站内两个前端应用都是本仓库的 npm workspace，由 CI 在 Hugo 之前构建：

| 应用 | 源码 | 路由 | 产物 |
|------|------|------|------|
| ColorCat | `apps/colorcat` | `/tools/colorcat/` | `static/tools/colorcat/assets/` |
| Spiral 文档 | `apps/spiral-docs` | `/docs/spiral/` | `static/docs/spiral/assets/` |

```text
push main → Actions（npm ci → 构建两个 app → hugo --minify）→ GitHub Pages
```

Spiral 文档通过 npm 上**已发布**的 `@aviala-design/spiral`、`@aviala-design/tokens`、`@aviala-design/icons` 消费组件库。因此文档展示的始终是用户能实际安装到的版本，本仓库不需要 clone [spiral-2](https://github.com/AvialaOSS/spiral-2)。

---

## 0. 一次性准备

### 本机工具

| 工具 | 用途 |
|------|------|
| Node.js 22+、npm | 构建 `apps/*` |
| Hugo Extended ≥ 0.148 | 本地预览（线上由 Actions 安装） |
| Git + GitHub 写权限 | push 本仓库 `main` |

### GitHub Pages 设置（确认一次即可）

[Settings → Pages](https://github.com/AvialaOSS/avialaWebsite/settings/pages)：**Source** 选 `GitHub Actions`（不要选 “Deploy from a branch”）。

工作流：`.github/workflows/hugo.yml`，由 push `main` 或 Actions 里手动 **Run workflow** 触发。

---

## 1. 日常发布（只改网站内容）

```bash
git checkout main && git pull origin main
# 编辑 content/ 或 themes/
git add … && git commit -m "…" && git push origin main
```

CI 会自行构建两个前端应用，无需本地构建。

---

## 2. 更新 Spiral 组件文档

文档内容（页面、Demo、MDX）改动，与上面的日常发布相同——直接改 `apps/spiral-docs/` 后 push 即可。

若要让文档反映**新的组件行为**，必须先在 Spiral2 发版：

1. Spiral2：`pnpm changeset` 记录变更，合并到 `main`
2. `release.yml` 通过 Changesets + npm Trusted Publishing（OIDC，无需 `NPM_TOKEN`）发布
3. 本仓库：`npm update @aviala-design/spiral @aviala-design/tokens @aviala-design/icons`
4. 提交更新后的 `package-lock.json` 并 push

> 组件 API 表格数据来自 `@aviala-design/spiral` 包内的 `props.json`。构建脚本 `apps/spiral-docs/scripts/sync-props.mjs` 会把它复制到 `src/generated/props.json`；若安装的版本尚未附带该文件，则回退到仓库里已提交的副本，并打印一条 warning。
>
> 组件更新记录来自 Spiral2 的 `packages/ui/changelogs/*.md`（构建为 `component-changelogs.json`）。`sync-changelog.mjs` 优先从已安装包或邻仓 Spiral2 同步，否则使用已提交的 `src/generated/component-changelogs.json`。
>
> 文档覆盖版本见 `apps/spiral-docs/src/versions/manifest.json`。构建时会查询 npm latest；若最新包高于文档 `default`，站点顶栏显示过时提醒。
>
> 正式构建（`npm run build:spiral-docs`）会对每个 covered patch：从 npm 安装对应 `@aviala-design/spiral` → 打出 `static/docs/spiral/v/{version}/`，并额外打一份默认版到 `static/docs/spiral/assets/`。深链由 404 页就地挂载 SPA（保留顶栏；`head` 里会在首屏前改掉 404 标题并隐藏 404 占位）。本地 `dev` 仍是单份 Vite（当前 lockfile 包），页头版本 Select 会**软切换**文档修订（`doc-revisions` / prose）；正式环境在多份 `/v/{version}/` 构建之间整页跳转。发版后自动开文档 PR：见 [SPIRAL_DOCS_DISPATCH.zh_cn.md](./SPIRAL_DOCS_DISPATCH.zh_cn.md)（英文：[SPIRAL_DOCS_DISPATCH.md](./SPIRAL_DOCS_DISPATCH.md)；需在 Spiral2 配置 `AVIALA_WEBSITE_TOKEN`）。

---

## 3. 本地预览

```bash
npm ci

# 只调文档 app（Vite HMR，最快；无站点顶栏）
npm run dev:spiral-docs        # http://localhost:5175/docs/spiral/

# 完整站点 + Spiral 文档 HMR（Hugo 顶栏 + Vite 热更新）
# 需同时跑 Vite(:5175) 与 Hugo(:1313)；`dev:site` 会一起拉起
npm run dev:site               # http://localhost:1313/docs/spiral/
# 或分别开两个终端：
#   npm run dev:spiral-docs
#   npm run dev:hugo

# 临时用邻仓 Spiral2 源码/产物（未发 npm 也能验组件）
# 默认解析 `../Spiral2`；可用 DOCS_SPIRAL_ROOT 覆盖路径
# tokens / icons 需在 Spiral2 里至少 build 过一次 dist
npm run dev:spiral-docs:local
npm run dev:site:local
# 强制用 Spiral2 packages/ui/dist（不要 src）：DOCS_SPIRAL_LOCAL_DIST=1

# 生产形态（静态产物嵌入 Hugo，无 HMR）
npm run build:colorcat
npm run build:spiral-docs
hugo server -D --bind 127.0.0.1 --port 1313
```

`hugo server` 下 `/docs/spiral/` 会从 `http://localhost:5175` 拉 Vite 模块（见 `themes/avialaStyle/layouts/docs/single.html`），因此改 `apps/spiral-docs` 可在 1313 上热更新；正式构建 / CI 仍用 `static/docs/spiral/` 静态资源。

`static/docs/spiral/`、`static/tools/colorcat/` 与 `data/spiraldocs.json` 都是构建产物，已在 `.gitignore` 中；**CI / 纯静态本地预览**前必须先构建。

站点顶栏搜索（`/index.json`）会合并 `data/spiraldocs.json` 里的 `searchPages`（由 `finalize.mjs` 从 nav / MDX / DocPageHeader / props 生成）。`dev:site` 的 Vite HMR **不会**刷新该索引；改完 Spiral 文档文案后需再跑 `npm run build:spiral-docs`（或至少 finalize）并重启 / 刷新 Hugo，搜索结果才会更新。

核对：

| URL | 预期 |
|-----|------|
| http://127.0.0.1:1313/docs/ | 文档 hub |
| http://127.0.0.1:1313/docs/spiral/ | 嵌入 Spiral 文档，保留站点顶栏 |
| http://127.0.0.1:1313/docs/spiral/start/introduction | HTTP 404，但就地挂载 SPA（不闪 404 文案；title 在首屏前改掉） |
| http://127.0.0.1:1313/tools/ | ColorCat 等工具页正常 |

深链走的是 `themes/avialaStyle/layouts/404.html`：就地挂载 Spiral SPA；`head.html` 在首屏前把 title 改成文档标题并隐藏 404 占位。

---

## 4. 确认线上部署

1. 打开 [Actions](https://github.com/AvialaOSS/avialaWebsite/actions) → 最新的 **Deploy Hugo site to Pages**
2. 等 **build** 与 **deploy** 均为绿色
3. 验证 `https://www.aviala.top/docs/`、`/docs/spiral/`、`/docs/spiral/start/introduction`、`/tools/`

资源文件名是固定的 `spiral-docs.js` / `spiral-docs.css`，缓存刷新靠 `data/spiraldocs.json` 里的 `assetVersion`（构建产物内容哈希）作为查询参数。

---

## 5. 故障排查

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| `Missing "./xxx-effects.css" specifier in "@aviala-design/tokens"` | 已发布的 tokens 版本还没有该导出 | 在 Spiral2 发版后 `npm update @aviala-design/tokens` |
| `DOCS_SPIRAL_LOCAL` 启动后样式/组件不对 | 邻仓 tokens/icons 未 build，或路径不是 `../Spiral2` | 在 Spiral2 执行 `pnpm --filter @aviala-design/tokens build` 与 icons build；或设 `DOCS_SPIRAL_ROOT` |
| 构建报 `Failed to resolve entry for package @aviala-design/spiral` | 命中了包里指向未发布 `src/` 的 `development` 导出条件 | 确认 `apps/spiral-docs/vite.config.ts` 的 `resolve.conditions` 未被改动 |
| 本地 `/docs/spiral/` 空白 | 没跑过 `npm run build:spiral-docs` | 先构建再启动 Hugo |
| API 表格缺列或过时 | 安装的 Spiral 版本无 `props.json`，回退到旧副本 | 发版后 `npm update`，构建日志会显示实际来源版本 |
| Actions 在 **Install Node.js dependencies** 失败 | `package-lock.json` 与 `package.json` 不同步 | 本地 `npm install` 后提交 lockfile |
| 线上仍是旧文档 | 浏览器缓存 | 硬刷新；`assetVersion` 变化时会自动失效 |

手动重跑部署：Actions → 选中工作流 → **Run workflow**（选 `main`）。

---

## 6. CI 实际步骤

`.github/workflows/hugo.yml`：

1. 安装 Hugo Extended `0.148.2` 与 Dart Sass
2. `actions/checkout`（含 submodule）
3. Node 22 + `npm ci`
4. `npm run build:colorcat`
5. `npm run build:spiral-docs`
6. `hugo --minify --baseURL <Pages base URL>/`
7. 上传 `public/` → `actions/deploy-pages`

---

## 相关路径速查

| 路径 | 作用 |
|------|------|
| `apps/spiral-docs/` | Spiral 文档 SPA 源码 |
| `apps/spiral-docs/scripts/sync-props.mjs` | 从已安装的 Spiral 包同步 API 元数据 |
| `apps/spiral-docs/scripts/sync-changelog.mjs` | 同步组件 changelog JSON |
| `apps/spiral-docs/scripts/sync-npm-latest.mjs` | 查询 npm 上最新 Spiral 版本（过时横幅） |
| `apps/spiral-docs/src/versions/manifest.json` | 文档已覆盖的 Spiral 版本与组件 inherit |
| `apps/spiral-docs/src/doc-revisions/` | 按组件 / 修订号的手写文档内容（`{Component}/{rev}.ts`） |
| `apps/spiral-docs/scripts/build-search-index.mjs` | 从 nav / MDX / DocPageHeader / props 生成 Spiral `searchPages` |
| `apps/spiral-docs/scripts/finalize.mjs` | 删除 Vite `index.html`，写 `data/spiraldocs.json`（含 `searchPages`） |
| `layouts/_default/index.json` | Fuse 搜索索引；合并 Spiral `searchPages` |
| `content/docs/` | `/docs/`、`/docs/spiral/` 的 Hugo 内容 |
| `themes/avialaStyle/layouts/docs/` | 文档 hub 与嵌入布局 |
| `themes/avialaStyle/layouts/404.html` | Spiral 深链回跳 |
| `.github/workflows/hugo.yml` | Pages 部署流水线 |
