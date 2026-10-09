import { useI18n } from '../../i18n/useI18n.js';
import { Head } from 'vite-react-ssg';
import { getSiteUrl, SITE } from '../../config/site';

const OG_IMAGE_URL = getSiteUrl('/og-image.png');
const PUBLISHER_LOGO_URL = getSiteUrl('/pwa-192x192.png');
const ABOUT_URL = getSiteUrl('/about');

function createBreadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, path }, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name,
      item: getSiteUrl(path),
    })),
  };
}

export function BlogIndexSeo({ description }) {
  const { t, localize, locale } = useI18n();
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
      url: ABOUT_URL,
      logo: {
        '@type': 'ImageObject',
        url: PUBLISHER_LOGO_URL,
      },
    },
  };
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: '首页', path: '/' },
    { name: '图片压缩指南', path: '/blog' },
  ]);

  return (
    <Head>
      <html lang={locale} />
      <title>{t("图片压缩指南 - JPG PNG WebP 格式与体积优化 - picthin")}</title>
      <meta name="description" content={t(description)} />
      <link rel="canonical" href={localize(pageUrl)} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={t("图片压缩指南 - picthin")} />
      <meta property="og:description" content={t(description)} />
      <meta property="og:url" content={localize(pageUrl)} />
      <meta property="og:image" content={t(OG_IMAGE_URL)} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t("图片压缩指南 - picthin")} />
      <meta name="twitter:description" content={t(description)} />
      <meta name="twitter:image" content={t(OG_IMAGE_URL)} />
      <script type="application/ld+json">{JSON.stringify(localize(schema))}</script>
      <script type="application/ld+json">{JSON.stringify(localize(breadcrumbSchema))}</script>
    </Head>
  );
}

export function BlogArticleSeo({ post, extraSchemas = [] }) {
  const { t, localize, locale } = useI18n();
  const pageUrl = getSiteUrl(post.path);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.articleTitle || post.title,
    description: post.description,
    image: OG_IMAGE_URL,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { '@type': 'Organization', name: 'PicThin 项目维护者', url: ABOUT_URL },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      url: ABOUT_URL,
      logo: { '@type': 'ImageObject', url: PUBLISHER_LOGO_URL },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    inLanguage: SITE.locale,
  };
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: '首页', path: '/' },
    { name: '图片压缩指南', path: '/blog' },
    { name: post.title, path: post.path },
  ]);

  return (
    <Head>
      <html lang={locale} />
      <title>{t(post.seoTitle || `${t(post.title)} - picthin`)}</title>
      <meta name="description" content={t(post.description)} />
      <meta name="keywords" content={t(post.keywords)} />
      <link rel="canonical" href={localize(pageUrl)} />
      <meta property="og:type" content="article" />
      <meta property="og:title" content={t(post.ogTitle || post.title)} />
      <meta property="og:description" content={t(post.description)} />
      <meta property="og:url" content={localize(pageUrl)} />
      <meta property="og:image" content={t(OG_IMAGE_URL)} />
      <meta property="article:published_time" content={t(post.datePublished)} />
      <meta property="article:modified_time" content={t(post.dateModified)} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={t(post.ogTitle || post.title)} />
      <meta name="twitter:description" content={t(post.description)} />
      <meta name="twitter:image" content={t(OG_IMAGE_URL)} />
      {[schema, breadcrumbSchema, ...extraSchemas].map((item, index) => (
        <script key={index} type="application/ld+json">{JSON.stringify(localize(item))}</script>
      ))}
    </Head>
  );
}
