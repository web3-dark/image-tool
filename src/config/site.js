import { SEO_PAGES } from './content.js';

const DEFAULT_SITE_URL = 'https://picthin.com';

const configuredSiteUrl = import.meta.env?.VITE_SITE_URL || DEFAULT_SITE_URL;

export const SITE_URL = configuredSiteUrl.replace(/\/+$/, '');

export const SITE = {
  name: 'picthin',
  title: 'picthin 图片压缩工具',
  description: '免费在线图片压缩工具，支持 JPEG、PNG、WebP、AVIF、GIF 格式，全程本地处理，不上传服务器。',
  locale: 'zh-CN',
  ogLocale: 'zh_CN',
  author: 'picthin',
};

export function getSiteUrl(path = '/') {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

export { SEO_PAGES };
