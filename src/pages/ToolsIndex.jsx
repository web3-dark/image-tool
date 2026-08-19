import { createElement } from 'react';
import { Head } from 'vite-react-ssg';
import { Link } from 'react-router-dom';
import { ArrowRight, Gauge, Images } from 'lucide-react';
import BlogLayout from '../components/BlogLayout';
import { FORMAT_TOOL_CONFIGS } from '../config/tools';
import { getSiteUrl } from '../config/site';

const PAGE_URL = getSiteUrl('/tools');
const OG_IMAGE_URL = getSiteUrl('/og-image.png');

const TOOL_CARDS = [
  {
    path: '/compress-image-to-size',
    title: '图片压缩到指定大小',
    description: '自动压到 100KB、200KB、500KB、1MB 或自定义体积以内。',
    icon: Gauge,
  },
  ...FORMAT_TOOL_CONFIGS.map((tool) => ({
    path: tool.path,
    title: tool.shortTitle,
    description: tool.lead,
    icon: Images,
  })),
];

const ITEM_LIST_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'PicThin 在线图片工具',
  itemListElement: TOOL_CARDS.map((tool, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: tool.title,
    url: getSiteUrl(tool.path),
  })),
};

const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首页', item: getSiteUrl('/') },
    { '@type': 'ListItem', position: 2, name: '图片工具', item: PAGE_URL },
  ],
};

export default function ToolsIndex() {
  return (
    <BlogLayout>
      <Head>
        <html lang="zh-CN" />
        <title>在线图片工具 - 压缩、指定大小与格式转换 - PicThin</title>
        <meta name="description" content="PicThin 免费在线图片工具：压缩 JPG、PNG，压缩到指定 KB，以及 PNG 转 WebP、WebP 转 JPG。全程浏览器本地处理。" />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="PicThin 在线图片工具" />
        <meta property="og:description" content="图片压缩、指定大小和格式转换，全程在浏览器本地完成。" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PicThin 在线图片工具" />
        <meta name="twitter:description" content="图片压缩、指定大小和格式转换，全程在浏览器本地完成。" />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(ITEM_LIST_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(BREADCRUMB_SCHEMA)}</script>
      </Head>

      <section className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <header className="max-w-3xl mb-10">
          <p className="text-sm text-foreground-muted mb-3">
            <Link to="/" className="hover:text-primary">首页</Link>
            <span className="mx-2">/</span>
            <span>图片工具</span>
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">在线图片工具</h1>
          <p className="text-base md:text-lg text-foreground-muted mt-4 leading-8">
            根据你的任务直接选择工具。所有图片都在浏览器本地处理，无需注册，不会上传到 PicThin 服务器。
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-4">
          {TOOL_CARDS.map(({ path, title, description, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className="group rounded-xl border border-border bg-surface p-5 hover:border-primary hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="flex items-center justify-center w-11 h-11 rounded-lg bg-primary-muted text-primary flex-shrink-0">
                  {createElement(Icon, { className: 'w-5 h-5' })}
                </span>
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">{title}</h2>
                  <p className="text-sm text-foreground-muted leading-6 mt-2">{description}</p>
                  <span className="inline-flex items-center text-sm font-medium text-primary mt-3">
                    打开工具 <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-12 rounded-xl border border-border bg-surface-muted p-5 md:p-6">
          <h2 className="text-xl font-semibold text-foreground">不知道该选哪个？</h2>
          <p className="text-foreground-muted leading-7 mt-2">
            照片通常用 JPG，透明图标和截图通常用 PNG，网页分发可优先考虑 WebP。可以先阅读
            {' '}<Link to="/blog/png-webp-jpg-comparison" className="text-primary hover:underline">图片格式完整对比</Link>，
            或直接使用 <Link to="/" className="text-primary hover:underline">通用批量图片压缩</Link>。
          </p>
        </section>
      </section>
    </BlogLayout>
  );
}
