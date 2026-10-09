# PicThin 私密反馈

## 已实现

- 首页和工具/文章页脚的「意见反馈」按钮，按需加载弹窗和 Turnstile。
- 类型、2–2000 字正文、选填邮箱、来源页面路径；不上传图片或文件名。
- `POST /api/feedback`：严格校验、16 KiB 请求上限、同源检查、Turnstile Siteverify 校验（成功、action、hostname 必须同时匹配）。
- 每个 IP 的短期 HMAC 摘要每 10 分钟最多提交 5 次；不存原始 IP。过期限频记录在后续有效提交时清理。
- 每次重试使用新验证码，相同内容沿用提交 UUID，避免网络超时造成重复留言。
- `/admin/feedback`：管理密钥登录，待处理/已处理筛选，每页 30 条、状态更新、永久删除。
- 密钥只保存在页面内存；管理 API 每次验证 Bearer 密钥。管理页与接口 `no-store`，管理页 `noindex`，Service Worker 不缓存管理页。
- 管理页面以纯文本渲染留言，不执行 HTML。邮箱只显示文本。

本版在管理页查看和处理反馈，**未接入邮件提醒**。反馈长期保存供跟进，站长可删除；D1 自身的备份恢复保留期仍由 Cloudflare 套餐决定。

## 2026-10-09 预览部署与验收

- 账号：`dark.claude.light@gmail.com`，Account ID `7372f9f38f48e1b583fbc4e7f169242d`。
- 现有 Pages 项目：`image-tool`，预览分支标识 `codex/feedback`（直接上传，未创建 Git 提交或推送）。
- 预览：<https://codex-feedback.image-tool-bk5.pages.dev/>。
- 管理页：<https://codex-feedback.image-tool-bk5.pages.dev/admin/feedback>。
- 部署地址：<https://1580d15f.image-tool-bk5.pages.dev/>。验证码后端只允许上面的固定预览域名，验收应使用固定域名。
- 独立 D1：`picthin-feedback-preview`，ID `9f8a1767-c37f-40f2-9880-3cb4203d6b66`，迁移已执行。
- Managed Turnstile：`PicThin private feedback`，公开 site key `0x4AAAAAAFSXg8RC673R77WW`，无 pre-clearance。
- 已配置 Preview 的 `FEEDBACK_DB` 与四个环境变量；正式环境配置及部署 `63dc9a78-39a5-4de6-8b0a-306f20af0df9` 未变。
- 预览密钥保存在本机 `.dev.vars.preview`（Git 忽略、权限 0600）。仅 `FEEDBACK_ADMIN_TOKEN` 用于管理页登录，不要提交此文件或公开其中内容。
- 通过：11 项自动测试、lint、构建、SEO 检查、Pages 本地运行、真实浏览器留言保存到远端 D1、未登录读取返回 401、已消费 Turnstile token 重放返回 403、浏览器管理页读取与处理状态修改。
- 预览基于当前工作区，也包含此前尚未提交的 SEO 修改；不代表这些修改已发布到正式站。

## 2026-10-09 正式环境配置

- 正式站：<https://picthin.com/>；管理页：<https://picthin.com/admin/feedback>。
- 独立生产 D1：`picthin-feedback`，ID `991a4a91-1931-41d6-96f6-0a0e40945f7e`，迁移已执行。
- 复用上面的 Managed Turnstile widget（已允许 `picthin.com`），生产后端只接受 `picthin.com`。
- Production 配置 `FEEDBACK_DB` 及四个环境变量，保留 `TOOL_ANALYTICS` 和原有统计设置。
- 独立生产管理密钥保存在本机 `.dev.vars.production`（Git 忽略、权限 0600）；其中 `FEEDBACK_ADMIN_TOKEN` 用于正式管理页登录。
- 通过 `main` 分支的 Git 提交触发正式部署。本次提交仅包含反馈功能，不包含工作区原有未提交的 SEO 改动。

生产与预览的数据库、管理密钥分别独立；预览测试数据不会进入生产数据库。

## 生产配置

沿用现有 Pages 项目与仪表盘部署配置；不添加会覆盖现有统计绑定的生产 `wrangler.jsonc`。

1. 在 PicThin 所属 Cloudflare 账号创建专用 D1 `picthin-feedback`。
2. 对该数据库执行 `migrations/0001_feedback.sql`。
3. 在现有 Pages 项目 **Production** 环境绑定数据库，变量名为 `FEEDBACK_DB`。
4. 创建 Managed Turnstile widget；生产站点为 `picthin.com`，action 由表单传入 `feedback`。本地若需真实联调，可另建测试 widget 或允许本地域名，但生产后端 `TURNSTILE_HOSTNAMES` 只能包含正式域名。
5. 在 Pages Production 环境配置：

| 名称 | 类型 | 值 |
| --- | --- | --- |
| `TURNSTILE_SITE_KEY` | 普通变量 | widget 公开 site key |
| `TURNSTILE_SECRET` | Secret | 对应 widget secret |
| `TURNSTILE_HOSTNAMES` | 普通变量 | `picthin.com` |
| `FEEDBACK_ADMIN_TOKEN` | Secret | 安全随机生成的 64 位十六进制密钥；保存在密码管理器中 |

以上都不是 `VITE_` 变量，管理密钥和 Turnstile secret 不可放入前端。前端只通过 `/api/feedback-config` 读取公开 site key。

使用经过确认的 Wrangler 可执行文件及目标账号配置远端资源；不要输出密钥，不要在命令行参数或提交记录中保存真实密钥。复用现有 widget 前核实域名与密钥目标，不轮换其它站点使用的 secret。

6. 保留现有 Web Analytics / TOOL_ANALYTICS 绑定，重新部署 Pages。Preview 使用独立测试数据库和密钥；未配置的预览环境会拒绝提交。
7. 上线验收：实际浏览器提交一次 → 管理页收到 → 标记已处理 → 未授权 API 返回 401 → 重放已消费验证码返回 403。站点验证服务不可用时不得放行。

反馈接口的限频是应用层保护，不替代 Cloudflare 的请求/费用配额。Functions 与现有 Workers 共用账号额度。

## 本地验证

当前 Node 测试使用 `node:sqlite`，建议 Node 22.13+。

```sh
npm test
npm run lint
npm run build
npm run seo:check
```

本地数据库配置在 `wrangler.local.jsonc`，固定 ID 仅用于本机数据库。假定受信任的 Wrangler v4 已安装并可执行：

```sh
wrangler d1 migrations apply picthin-feedback-local --local --config wrangler.local.jsonc
wrangler pages dev dist --d1 FEEDBACK_DB=00000000-0000-0000-0000-000000000001 --compatibility-date 2026-08-27 --ip 127.0.0.1 --port 8789
```

Pages dev 不接受自定义配置路径，因此启动时显式指定同一本地数据库 ID。此 compatibility date 与已验证的本地 Wrangler 4.125.0 runtime 相容；生产保留现有 Pages compatibility date。

复制 `.dev.vars.example` 为已忽略的 `.dev.vars`，再配置本地凭据。留空配置时可以验证弹窗与管理页外观，但提交会安全拒绝。正式 Turnstile 校验要求精确 hostname 与 action，不能靠测试 key 绕过这些条件。

自动测试使用真实 SQLite 执行迁移和查询，并模拟 Siteverify 的成功、伪造、错误域名、过期重放和网络故障；这不等于真实 Cloudflare widget 的端到端验收。

## 密钥与维护

- 管理页入口：`https://picthin.com/admin/feedback`。页面壳可公开访问，数据接口始终鉴权；隐藏网址不是安全措施。
- 更换管理密钥：更新 Pages 的 `FEEDBACK_ADMIN_TOKEN` 并重新部署，旧密钥立即对新部署失效。
- 不会自动给访客或站长发送消息；若需要邮件提醒，应另外接入并验证投递。
- 删除在活动数据库中立即生效；已有 Cloudflare 备份可能在其保留期内继续存在。

官方参考：[Pages 绑定](https://developers.cloudflare.com/pages/functions/bindings/)、[Turnstile 服务端验证](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)。
