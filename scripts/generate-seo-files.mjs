#!/usr/bin/env node

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { SEO_PAGES } from '../src/config/content.js';

const DEFAULT_SITE_URL = 'https://picthin.com';

function normalizeSiteUrl(siteUrl) {
  return siteUrl.replace(/\/+$/, '');
}

function getSiteUrl(path, siteUrl) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

function buildSitemap(siteUrl) {
  const urls = SEO_PAGES
    .map((page) => `  <url>
    <loc>${getSiteUrl(page.path, siteUrl)}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRobots(siteUrl) {
  return `User-agent: *
Allow: /

Sitemap: ${getSiteUrl('/sitemap.xml', siteUrl)}
`;
}

const siteUrl = normalizeSiteUrl(process.env.SITE_URL || process.env.VITE_SITE_URL || DEFAULT_SITE_URL);

writeFileSync(resolve('public/sitemap.xml'), buildSitemap(siteUrl));
writeFileSync(resolve('public/robots.txt'), buildRobots(siteUrl));

console.log(`Generated public/sitemap.xml and public/robots.txt for ${siteUrl}`);
