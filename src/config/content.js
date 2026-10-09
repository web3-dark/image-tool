import { FORMAT_TOOL_CONFIGS } from './tools.js';
import { TARGET_SIZE_PAGE_CONFIGS } from './targetSizes.js';

export const BLOG_POSTS = [
  {
    path: '/blog/registration-photo-under-200kb',
    slug: 'registration-photo-under-200kb',
    title: '报名照片超过 200KB：压缩步骤与上传失败排查',
    seoTitle: '报名照片怎么压缩到 200KB 以内？格式与尺寸检查 - PicThin',
    description: '照片超过上传限制时，先确认格式、像素和文件大小，再压缩到 200KB 以内。附本地处理步骤、示例结果，以及压完仍无法上传的排查方法。',
    datePublished: '2026-10-01',
    dateModified: '2026-10-01',
    category: '上传问题',
    readingTime: '4 分钟',
    keywords: '报名照片200KB,照片压缩到200KB,图片上传失败,照片文件大小',
  },
  {
    path: '/blog/compress-png-keep-transparency',
    slug: 'compress-png-keep-transparency',
    title: 'PNG 怎么压小并保留透明背景',
    seoTitle: 'PNG 怎么压缩并保留透明背景？颜色、清晰度与体积 - PicThin',
    description: '透明 Logo、图标和截图怎么压小？了解 PNG 颜色量化，按步骤调整质量，并检查透明边缘、文字和渐变；文件没有变小时也有对应处理方法。',
    datePublished: '2026-10-01',
    dateModified: '2026-10-01',
    category: '实用教程',
    readingTime: '4 分钟',
    keywords: 'PNG压缩,保留透明背景,透明图片压缩,PNG文件太大',
  },
  {
    path: '/blog/webp-upload-convert-jpg',
    slug: 'webp-upload-convert-jpg',
    title: 'WebP 图片无法上传：正确转成 JPG 的方法',
    seoTitle: 'WebP 图片无法上传怎么办？本地转 JPG 教程 - PicThin',
    description: '表单只支持 JPG，而下载的图片是 WebP？不要直接改后缀。按步骤转换、下载并检查体积，了解透明背景丢失和转换后变大的原因。',
    datePublished: '2026-10-01',
    dateModified: '2026-10-01',
    category: '上传问题',
    readingTime: '3 分钟',
    keywords: 'WebP转JPG,WebP无法上传,图片格式不支持,WebP改后缀',
  },
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
    lastmod: '2026-10-01',
    changefreq: 'monthly',
    priority: '1.0',
  },
  {
    path: '/tools',
    lastmod: '2026-08-21',
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    path: '/compress-image-to-size',
    lastmod: '2026-08-21',
    changefreq: 'monthly',
    priority: '0.9',
  },
  ...TARGET_SIZE_PAGE_CONFIGS.map((page) => ({
    path: page.path,
    lastmod: page.dateModified || '2026-08-21',
    changefreq: 'monthly',
    priority: '0.9',
  })),
  ...FORMAT_TOOL_CONFIGS.map((tool) => ({
    path: tool.path,
    lastmod: tool.dateModified || '2026-08-18',
    changefreq: 'monthly',
    priority: '0.9',
  })),
  {
    path: '/blog',
    lastmod: '2026-10-01',
    changefreq: 'weekly',
    priority: '0.7',
  },
  {
    path: '/about',
    lastmod: '2026-08-18',
    changefreq: 'yearly',
    priority: '0.5',
  },
  {
    path: '/remove-image-metadata',
    lastmod: '2026-08-21',
    changefreq: 'monthly',
    priority: '0.9',
  },
  ...BLOG_POSTS.map((post) => ({
    path: post.path,
    lastmod: post.dateModified,
    changefreq: 'monthly',
    priority: '0.8',
  })),
];
