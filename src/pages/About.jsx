import { createElement } from 'react';
import { Head } from 'vite-react-ssg';
import { Link } from 'react-router-dom';
import { Github, LockKeyhole, MonitorSmartphone, Workflow } from 'lucide-react';
import BlogLayout from '../components/BlogLayout';
import { getSiteUrl, SITE } from '../config/site';

const PAGE_URL = getSiteUrl('/about');

const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'PicThin',
  url: getSiteUrl('/'),
  logo: getSiteUrl('/pwa-192x192.png'),
  description: SITE.description,
  sameAs: ['https://github.com/web3-dark/image-tool'],
};

const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '首页', item: getSiteUrl('/') },
    { '@type': 'ListItem', position: 2, name: '关于 PicThin', item: PAGE_URL },
  ],
};

export default function About() {
  return (
    <BlogLayout>
      <Head>
        <html lang="zh-CN" />
        <title>关于 PicThin - 本地、私密的在线图片处理工具</title>
        <meta name="description" content="了解 PicThin 的开发目的、浏览器本地图片处理方式、隐私原则和内容测试方法。" />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="关于 PicThin" />
        <meta property="og:description" content="本地、私密、无需注册的在线图片压缩与转换工具。" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content={getSiteUrl('/og-image.png')} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="关于 PicThin" />
        <meta name="twitter:description" content="本地、私密、无需注册的在线图片压缩与转换工具。" />
        <meta name="twitter:image" content={getSiteUrl('/og-image.png')} />
        <script type="application/ld+json">{JSON.stringify(ORGANIZATION_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(BREADCRUMB_SCHEMA)}</script>
      </Head>

      <article className="blog-article max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <header className="mb-10">
          <p className="text-sm text-foreground-muted mb-3">
            <Link to="/" className="hover:text-primary">首页</Link>
            <span className="mx-2">/</span>
            <span>关于 PicThin</span>
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">关于 PicThin</h1>
          <p className="lead mt-5">
            PicThin 是一个专注图片压缩与格式转换的免费工具。项目由 PicThin 项目维护者持续开发，目标是让常见图片任务在浏览器里直接完成，不要求上传原图或注册账号。
          </p>
        </header>

        <h2>为什么做 PicThin</h2>
        <p>
          很多在线图片工具需要先把文件上传到服务器。对于证件照、合同截图、工作素材和私人照片，这会带来不必要的等待与隐私顾虑。PicThin 选择在浏览器本地读取和编码图片，让文件尽可能留在用户自己的设备里。
        </p>

        <div className="grid md:grid-cols-3 gap-4 my-8">
          {[
            [LockKeyhole, '本地处理', '图片不发送到 PicThin 服务器，刷新页面后也不会保留原图。'],
            [MonitorSmartphone, '跨设备使用', '现代手机和电脑浏览器均可直接使用，无需安装客户端。'],
            [Workflow, '任务导向', '每个页面围绕一个具体需求设计，减少不必要的选项和步骤。'],
          ].map(([Icon, title, description]) => (
            <section key={title} className="rounded-lg border border-border bg-surface p-4">
              {createElement(Icon, { className: 'w-5 h-5 text-primary mb-3' })}
              <h3 className="!text-base !mt-0 !mb-2">{title}</h3>
              <p className="!text-sm !text-foreground-muted !leading-6 !mb-0">{description}</p>
            </section>
          ))}
        </div>

        <h2>图片是怎样处理的</h2>
        <p>
          用户选择图片后，浏览器会在本机内存中读取文件，通过 Canvas、图片编码器和 Web Worker 完成压缩或格式转换。处理结果只用于页面预览和用户主动下载，不会写入 PicThin 的数据库。
        </p>

        <h2>内容与测试方法</h2>
        <p>
          PicThin 的教程围绕工具的实际使用场景编写。涉及压缩效果时，会使用明确的格式、尺寸、质量参数和文件大小进行对比；涉及浏览器兼容性时，会优先参考格式规范和浏览器支持数据。文章不会仅为了更新日期而修改时间。
        </p>

        <h2>项目与反馈</h2>
        <p>
          PicThin 的源代码和变更记录可以在 GitHub 查看。遇到兼容性问题、压缩结果异常或希望增加新的图片工具，可以通过项目仓库提交反馈。
        </p>
        <p>
          <a
            href="https://github.com/web3-dark/image-tool"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            查看 PicThin GitHub 项目
          </a>
        </p>
      </article>
    </BlogLayout>
  );
}
