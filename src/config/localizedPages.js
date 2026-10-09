import { SEO_PAGES } from './content.js';
import { localizePath } from '../i18n/paths.js';

export const LOCALIZED_SEO_PAGES = SEO_PAGES.flatMap((page) => [
  { ...page, language: 'zh', basePath: page.path },
  { ...page, path: localizePath(page.path, 'en'), language: 'en', basePath: page.path, lastmod: '2026-10-10' },
]);
