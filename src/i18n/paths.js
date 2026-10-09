import { SEO_PAGES } from '../config/content.js';

const pagePaths = new Set(SEO_PAGES.map(({ path }) => path));

export function getPathLanguage(pathname) {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'zh';
}

export function getBasePath(pathname) {
  const path = getPathLanguage(pathname) === 'en' ? pathname.slice(3) || '/' : pathname;
  return path === '/' ? path : path.replace(/\/+$/, '');
}

export function isPublicPage(pathname) {
  return pagePaths.has(getBasePath(pathname));
}

export function localizePath(target, language) {
  if (typeof target === 'object' && target !== null) {
    return target.pathname ? { ...target, pathname: localizePath(target.pathname, language) } : target;
  }
  if (typeof target !== 'string' || !target.startsWith('/') || target.startsWith('//')) return target;
  const [, pathname, suffix] = target.match(/^([^?#]*)(.*)$/);
  if (!isPublicPage(pathname)) return target;
  const base = getBasePath(pathname);
  return `${language === 'en' ? `/en${base === '/' ? '' : base}` : base}${suffix}`;
}

export function localizeSiteUrl(value, language, siteUrl) {
  if (typeof value !== 'string' || !value.startsWith(`${siteUrl}/`)) return value;
  return `${siteUrl}${localizePath(value.slice(siteUrl.length), language)}`;
}

export function localizeSchemaUrls(value, language, siteUrl) {
  if (typeof value === 'string') return localizeSiteUrl(value, language, siteUrl);
  if (Array.isArray(value)) return value.map((item) => localizeSchemaUrls(item, language, siteUrl));
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, localizeSchemaUrls(item, language, siteUrl)]));
  }
  return value;
}
