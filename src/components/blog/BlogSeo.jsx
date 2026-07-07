import { Head } from 'vite-react-ssg';
import { getSiteUrl, SITE } from '../../config/site';

const OG_IMAGE_URL = getSiteUrl('/og-image.png');
const PUBLISHER_LOGO_URL = getSiteUrl('/pwa-192x192.png');

export function BlogIndexSeo({ description }) {
  const pageUrl = getSiteUrl('/blog');
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'picthin 图片压缩指南',
    description,
    url: pageUrl,
    inLanguage: SITE.locale,
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: {
        '@type': 'ImageObject',
        url: PUBLISHER_LOGO_URL,
      },
    },
  };

  return (
    <Head>
      <html lang="zh-CN" />
      <title>图片压缩指南 - JPG PNG WebP 格式与体积优化 - picthin</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={pageUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content="图片压缩指南 - picthin" />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={OG_IMAGE_URL} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="图片压缩指南 - picthin" />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={OG_IMAGE_URL} />
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Head>
  );
}

export function BlogArticleSeo({ post, extraSchemas = [] }) {
  const pageUrl = getSiteUrl(post.path);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.articleTitle || post.title,
    description: post.description,
    image: OG_IMAGE_URL,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: PUBLISHER_LOGO_URL },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    inLanguage: SITE.locale,
  };

  return (
    <Head>
      <html lang="zh-CN" />
      <title>{post.seoTitle || `${post.title} - picthin`}</title>
      <meta name="description" content={post.description} />
      <meta name="keywords" content={post.keywords} />
      <link rel="canonical" href={pageUrl} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={post.ogTitle || post.title} />
      <meta property="og:description" content={post.description} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:image" content={OG_IMAGE_URL} />
      <meta property="article:published_time" content={post.datePublished} />
      <meta property="article:modified_time" content={post.dateModified} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.ogTitle || post.title} />
      <meta name="twitter:description" content={post.description} />
      <meta name="twitter:image" content={OG_IMAGE_URL} />
      {[schema, ...extraSchemas].map((item, index) => (
        <script key={index} type="application/ld+json">{JSON.stringify(item)}</script>
      ))}
    </Head>
  );
}
