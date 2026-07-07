import { Link } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import BlogLayout from '../../components/BlogLayout';
import { BLOG_POSTS } from '../../config/content';
import { getSiteUrl, SITE } from '../../config/site';

const PAGE_URL = getSiteUrl('/blog');
const OG_IMAGE_URL = getSiteUrl('/og-image.png');
const DESCRIPTION = 'picthin 图片压缩指南：学习 JPG、PNG、WebP、AVIF 的压缩原理、格式选择、安全处理和批量优化方法。';

const BLOG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: 'picthin 图片压缩指南',
  description: DESCRIPTION,
  url: PAGE_URL,
  inLanguage: SITE.locale,
  publisher: {
    '@type': 'Organization',
    name: SITE.name,
    logo: {
      '@type': 'ImageObject',
      url: getSiteUrl('/pwa-192x192.png'),
    },
  },
};

export default function BlogIndex() {
  return (
    <BlogLayout>
      <Head>
        <html lang="zh-CN" />
        <title>图片压缩指南 - JPG PNG WebP 格式与体积优化 - picthin</title>
        <meta name="description" content={DESCRIPTION} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="图片压缩指南 - picthin" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="图片压缩指南 - picthin" />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(BLOG_SCHEMA)}</script>
      </Head>

      <section className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <header className="mb-10">
          <p className="text-sm text-foreground-muted mb-3">
            <Link to="/" className="hover:text-primary">首页</Link>
            <span className="mx-2">/</span>
            <span>博客</span>
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            图片压缩指南
          </h1>
          <p className="text-base text-foreground-muted mt-4 leading-7">
            从实际问题出发，讲清楚图片为什么会变大、怎么压小、什么时候该换格式，以及如何在不上传图片的前提下安全处理。
          </p>
        </header>

        <div className="divide-y divide-border border-y border-border">
          {BLOG_POSTS.map((post) => (
            <article key={post.path} className="py-6">
              <Link to={post.path} className="group block">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-foreground-muted mt-2">
                  更新于 {post.dateModified}
                </p>
                <p className="text-base text-foreground-muted leading-7 mt-3">
                  {post.description}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </BlogLayout>
  );
}
