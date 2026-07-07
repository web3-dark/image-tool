export const BLOG_POSTS = [
  {
    path: '/blog/jpg-compress-to-target-size',
    slug: 'jpg-compress-to-target-size',
    title: 'JPG 图片怎么压缩到指定大小',
    seoTitle: 'JPG 图片怎么压缩到指定大小？压到 1MB / 500KB 的实用方法 - picthin',
    ogTitle: 'JPG 图片怎么压缩到指定大小',
    description: '想把 JPG 照片压缩到 1MB、500KB 或 200KB 以下？这篇文章讲清楚质量、尺寸、格式三种压缩方式，以及如何用本地工具反复调到目标体积。',
    datePublished: '2026-07-08',
    dateModified: '2026-07-08',
    category: '实用教程',
    readingTime: '5 分钟',
    keywords: 'JPG压缩到指定大小,图片压缩到1MB,照片压缩到500KB,JPG压缩,在线压缩图片,本地图片压缩',
  },
  {
    path: '/blog/png-webp-jpg-comparison',
    slug: 'png-webp-jpg-comparison',
    title: '图片格式怎么选？PNG、JPG、WebP、AVIF 完整对比',
    seoTitle: '图片格式怎么选？PNG、JPG、WebP、AVIF 完整对比 - picthin',
    ogTitle: '图片格式怎么选？PNG、JPG、WebP、AVIF 完整对比',
    articleTitle: '图片格式怎么选？PNG、JPG、WebP、AVIF 完整对比 + 压缩原理',
    description: 'PNG、JPG、WebP、AVIF 完整对比：原理、压缩方式、文件大小、浏览器兼容性，以及不同场景该怎么选。一篇 3500 字讲透图片格式。',
    datePublished: '2026-05-20',
    dateModified: '2026-07-08',
    category: '格式基础',
    readingTime: '12 分钟',
    keywords: 'PNG JPG区别,WebP是什么,AVIF格式,图片格式对比,WebP兼容性,PNG压缩原理,JPG有损压缩,图片格式选择',
  },
];

export function getBlogPost(path) {
  const post = BLOG_POSTS.find((item) => item.path === path);

  if (!post) {
    throw new Error(`Missing blog post config for ${path}`);
  }

  return post;
}

export const SEO_PAGES = [
  {
    path: '/',
    lastmod: '2026-07-08',
    changefreq: 'monthly',
    priority: '1.0',
  },
  {
    path: '/blog',
    lastmod: '2026-07-08',
    changefreq: 'weekly',
    priority: '0.7',
  },
  ...BLOG_POSTS.map((post) => ({
    path: post.path,
    lastmod: post.dateModified,
    changefreq: 'monthly',
    priority: '0.8',
  })),
];
