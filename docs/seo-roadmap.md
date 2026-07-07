# picthin SEO Roadmap

这个项目的 SEO 目标不是先追大词，而是从明确、低竞争、转化意图强的长尾词开始学习和验证。

## Phase 1: 上线基础

- 绑定正式域名，并确认全站只有一个规范域名。
- 构建前自动生成 `public/sitemap.xml` 和 `public/robots.txt`。
- 检查首页和博客页的 `title`、`description`、`canonical`、Open Graph、JSON-LD。
- 提交 Google Search Console、Bing Webmaster、百度站长。
- 确认 Cloudflare Pages 或托管平台启用 HTTPS，并把 HTTP 跳转到 HTTPS。
- 部署前运行 `npm run seo:check`，避免旧域名、缺失 canonical 或社交标签混进产物。

## Phase 2: 第一批关键词

优先围绕真实需求做页面，而不是只堆关键词。

- 图片压缩
- 在线压缩图片
- JPG 压缩
- PNG 压缩
- WebP 转 JPG
- PNG 转 WebP
- 图片格式转换
- 批量压缩图片
- 本地图片压缩
- 不上传图片压缩

## Phase 3: 内容计划

第一阶段建议每篇文章只解决一个问题。

- PNG、JPG、WebP、AVIF 怎么选（已完成）
- JPG 图片怎么压缩到指定大小（已完成）
- PNG 为什么压缩后还是很大
- WebP 和 JPG 哪个更适合网页
- 图片压缩会不会影响清晰度
- 为什么本地图片压缩更安全

## Phase 4: 每周复盘

- Search Console 里看展示量、点击量、平均排名。
- 找有展示但点击低的页面，优化标题和描述。
- 找排名 8-20 位的词，补内容、补内链。
- 记录每次改动日期，至少观察 2-4 周再判断效果。

## 常用命令

正式构建和检查：

```bash
VITE_SITE_URL=https://picthin.com npm run build
npm run seo:check
```
