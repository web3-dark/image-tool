# 图片压缩工具

免费在线图片压缩，支持 JPEG、PNG、WebP、AVIF、GIF，全程本地处理，不上传服务器。

## 技术栈

- React 18 + Vite
- Tailwind CSS
- Web Worker（PNG 色彩量化）
- Canvas API（图片压缩）
- PWA（vite-plugin-pwa）

## 本地开发

```bash
npm install
npm run dev
```

## 构建部署

```bash
npm run build      # 自动生成 sitemap/robots，产物在 dist/
npm run seo:check  # 检查 dist 中的 canonical、OG、sitemap、旧域名残留
```

正式域名构建：

```bash
VITE_SITE_URL=https://picthin.com npm run build
npm run seo:check
```

---

## 上线前必做清单

### 1. 配置正式域名

项目的页面 SEO URL 统一来自 [src/config/site.js](src/config/site.js)，构建时用 `VITE_SITE_URL` 注入正式域名。

```bash
VITE_SITE_URL=https://picthin.com npm run build
npm run seo:check
```

这会更新：

| 文件 | 作用 |
| --- | --- |
| [public/sitemap.xml](public/sitemap.xml) | sitemap loc |
| [public/robots.txt](public/robots.txt) | Sitemap 绝对路径 |
| React 页面 Head | canonical、og:url、og:image、JSON-LD url |

新增页面时先更新 [src/config/content.js](src/config/content.js)，`sitemap.xml` 会在构建前自动生成。

### 2. 生成 og-image.png（社交分享卡片）

微信/Twitter/Facebook 分享时需要一张 `1200×630` 的 PNG 图片。

当前分享图已生成到 [public/og-image.png](public/og-image.png)。修改 [public/og-image.svg](public/og-image.svg) 后重新导出 `1200×630` PNG。

> Twitter 不支持 SVG 格式，必须提供 PNG。

### 3. 提交搜索引擎站长平台

上线后到各平台验证域名并提交 sitemap，获取的验证码填入 [index.html](index.html) 对应注释位置：

| 平台 | 地址 | index.html 中的 meta |
| --- | --- | --- |
| 百度站长 | <https://ziyuan.baidu.com/site/siteadd> | `baidu-site-verification` |
| Bing Webmaster | <https://www.bing.com/webmasters> | `msvalidate.01` |
| Google Search Console | <https://search.google.com/search-console> | `google-site-verification` |

提交 sitemap 地址：`https://picthin.com/sitemap.xml`

### 4. 启用访问统计（可选）

项目已预留 [Umami](https://umami.is)（开源、无 Cookie、GDPR 合规）接入点。

在 [index.html](index.html) 中取消注释并替换参数：

```html
<script defer src="https://YOUR_UMAMI_HOST/script.js" data-website-id="YOUR_WEBSITE_ID"></script>
```

---

## 项目结构

```text
src/
├── App.jsx                    # 主应用，状态管理
├── main.jsx                   # 入口，包裹 ErrorBoundary
├── index.css                  # 全局样式 + iOS 兼容
├── components/
│   ├── ImageUploader.jsx      # 拖拽上传区域
│   ├── PreviewPanel.jsx       # 单张预览（含图片放大模态框）
│   ├── BatchResultsPanel.jsx  # 批量结果列表
│   ├── BrowserCompat.jsx      # 浏览器兼容性提示
│   ├── ErrorBoundary.jsx      # React 错误边界
│   ├── PrivacyPolicy.jsx      # 隐私政策弹窗
│   ├── Logo.jsx               # Logo 组件
│   └── ui/                    # shadcn/ui 基础组件
└── utils/
    ├── imageProcessor.js      # 图片压缩核心逻辑
    └── pngQuantWorker.js      # PNG 色彩量化 Web Worker
public/
├── favicon.svg / favicon.ico
├── apple-touch-icon-180x180.png
├── manifest.json              # PWA 配置
├── robots.txt                 # 爬虫规则
├── sitemap.xml                # 站点地图
└── og-image.svg               # 社交分享卡片设计稿（需导出为 PNG）
```
