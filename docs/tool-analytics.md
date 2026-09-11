# 匿名工具统计与缓存验收

## 发布配置

现有 Cloudflare Web Analytics 继续统计访问量。工具事件单独写入 Analytics Engine，不会出现在 Web Analytics 的访问量图表中。

在现有 Pages 项目的 **Settings → Bindings → Add → Analytics engine** 添加：

- 变量名：`TOOL_ANALYTICS`
- 数据集：`picthin_tool_events`

随后在生产构建环境设 `VITE_TOOL_ANALYTICS_ENABLED=true` 并重新部署。当前仓库沿用控制台管理 Pages 配置，不引入会覆盖既有配置的 Wrangler 文件。绑定和部署完成前，不能声称线上已开始采集。

只在 `picthin.com` 发送事件；本地、预览域名以及开启 DNT/GPC 的浏览器不发送。默认不开启，统计发送失败不会阻断图片处理。缺少绑定时端点返回 503，前端在当前页面生命周期内停止继续上报。预览验收使用测试函数的内存绑定，不写生产数据。

## 指标口径

| 事件 | 含义 | count |
| --- | --- | --- |
| image_selected | 通过格式和大小验证后交给工具的图片 | 此次选择的图片数 |
| process_started | 一张图片的一次处理尝试 | 1 |
| process_succeeded | 当前尝试成功并可展示结果 | 1 |
| process_failed | 当前尝试失败 | 1 |
| process_cancelled | 新任务、修改参数或离开页面使结果作废 | 1 |
| download_clicked | 已触发浏览器下载，不代表文件成功保存 | 此次下载包含的图片数 |

修改质量重新处理会增加尝试数，重复下载会增加点击数。选择事件不包含被上传组件拒绝的文件。关闭标签或网络失败可能丢失事件；这是聚合使用统计，不是按用户去重或可关联到某人的转化漏斗。处理成功率可按 `成功 / (成功 + 失败)` 计算，同时单独查看取消量。不要用下载数除以访问次数当作独立用户转化率。

字段固定：`blob1=event`、`blob2=tool`、`blob3=format`、`blob4=error`、`double1=count`、`double2=durationMs`、`index1=tool`。耗时取整到 100ms。格式是目标输出格式；无标识符、Cookie、IP、来源地址、查询参数、文件名、图片内容或原始错误堆栈。标准 HTTP 网络传输仍由 Cloudflare 处理；以上限制针对应用写入的数据集。

配置本机环境变量 `CLOUDFLARE_ACCOUNT_ID` 和具备 Account Analytics Read 权限的 `CLOUDFLARE_API_TOKEN` 后运行：

```sh
npm run analytics:report
```

命令读取最近 7 天的分工具事件数、图片数和平均耗时，使用 `_sample_interval` 加权以兼容采样。API token 只用于本机读取，不能放入 `VITE_` 变量或提交代码。

## 缓存行为

- HTML 不再预缓存为固定首页；导航在线时读取网络，离线时回退到同一路径的已访问页面。
- 不设置超时后提前返回旧 HTML，避免慢网时再次加载旧路由。
- HTML 与 `/sw.js` 要求重新验证；哈希静态资源保留现有缓存行为。
- Service Worker 更新后提示用户先下载图片再刷新，不主动刷新丢失本地图片。
- 已经安装旧 Worker 的浏览器，在新 Worker 下载并接管前仍可能经历一次旧页面；新版本无法追溯修改正在运行的旧 JavaScript。

验证命令：

```sh
npm test
npm run build
npm run lint
npm run seo:check
node tests/pwa-browser-server.mjs
```

在浏览器打开 `http://localhost:4179/__pwa-check`，点击运行：复现旧 Worker 的新路由 404 → 安装新 Worker → 正确加载深层页面 → 同一路径获取新 HTML → 网络失败时正确离线回退 → 未知地址不返回首页。重新运行请使用新端口或清除此测试站点的 Service Worker。

发布后还需在真实 Pages 环境验证一次匿名事件写入和 SQL 读取。本地内存绑定通过不代表 Cloudflare 线上已入库。

参考：[Pages Analytics Engine 绑定](https://developers.cloudflare.com/pages/functions/bindings/#analytics-engine)、[Analytics Engine 写入与采样查询](https://developers.cloudflare.com/analytics/analytics-engine/get-started/)。
