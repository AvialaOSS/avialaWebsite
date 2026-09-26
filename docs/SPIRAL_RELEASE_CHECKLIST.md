# Spiral 与文档站发布

使用 developer-kit 的 Changesets 工作流发布 npm 包，再更新本仓库版本化文档。不要把本地源码联调结果当作 npm 产物验收。

## 1. 组件库

1. 为用户可见变更补组件 changelog 与 changeset；核对 `pnpm changeset status` 的三个独立版本。
2. 合并通过 CI 的实现 PR。Release 工作流创建 `chore: version packages` PR，执行 Changesets 并将组件 Unreleased 条目盖章为正式版本。
3. 核对版本 PR、依赖范围与限制说明，CI 通过后合并。Release 使用 npm OIDC 发布公开 `latest`，无需本机 npm token。
4. 分别验证 Spiral、tokens、icons 的 npm 版本、dist-tag 和实际下载产物。npm 元数据与 tarball 可能分时可见；scaffold 最多等待约 10 分钟，超时后重试，不能退回旧依赖。失败时先检查已发布的包，不能假定三个包全成功或全部失败。

## 2. 文档

1. 自动 dispatch 或手动运行 `scaffold-spiral-docs.yml`，为已发布 Spiral 创建 draft 文档版本。
2. 审阅该版本的组件说明、代码演示、API 元数据与 companion 包版本。生成的 scaffold 不是完成验收。
3. 更新新组件路由、导航、升级指南和已知限制。旧版本文档继承旧 revision；新版演示只放新版 revision。
4. `npm ci`，运行 `npm run typecheck -w @aviala/spiral-docs` 和 `npm run build:spiral-docs`。版本构建必须从 `DOCS_PKG_ROOT` 指定的 npm 缓存取包和元数据，不能被相邻开发仓库覆盖。
5. 将 manifest 中该版本标记 `ready`，设置 `default`，提交依赖与 lockfile。保留历史文档版本。
6. 合并文档 PR 后，`Deploy Hugo site to Pages` 构建 ColorCat、全部文档版本和 Hugo，再部署。检查 workflow 成功及线上默认/固定版本入口。

## 本地联调

仅开发时显式设置 `DOCS_SPIRAL_ROOT` 为组件库路径。发布构建清除此覆盖。不要提交机器绝对路径、QA 快照、生成缓存或临时文件。

## 3.1 发布范围与限制

Spiral 3.1.0、tokens 2.7.0、icons 2.5.0：Theme Engine 标准项目消费、组件 Token 迁移、Rate/RateIcon、MultiSelect、InputGroup、ButtonGroup，以及 Card heading、TimePicker 秒列等可选能力。

保留并公开 Card Figma heading 字体阻碍、Upload 图标未完全 Token 化、destructive 缺少 Figma 对应、部分滚轮及 Figma 回写真机交互验收尚未完成。自动化检查不代表这些验收已经完成。
