#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { LOCALIZED_SEO_PAGES as SEO_PAGES } from '../src/config/localizedPages.js';
import { localizePath } from '../src/i18n/paths.js';
import { onRequest as redirectDuplicateHost } from '../functions/_middleware.js';

const SITE_URL = (process.env.SITE_URL || process.env.VITE_SITE_URL || 'https://picthin.com').replace(/\/+$/, '');
const DIST_DIR = resolve('dist');
const FORBIDDEN = ['image-tool-bk5.pages.dev', 'YOUR_DOMAIN', 'your-domain.com'];

function getSiteUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

function readDistFile(path) {
  const filePath = resolve(DIST_DIR, path);

  if (!existsSync(filePath)) {
    throw new Error(`Missing dist file: ${path}`);
  }

  return readFileSync(filePath, 'utf8');
}

function assertIncludes(content, expected, label) {
  if (!content.includes(expected)) {
    throw new Error(`${label} missing: ${expected}`);
  }
}

function assertNoForbidden(content, label) {
  for (const value of FORBIDDEN) {
    if (content.includes(value)) {
      throw new Error(`${label} contains forbidden value: ${value}`);
    }
  }
}

function assertValidJson(content, label) {
  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`${label} is not valid JSON: ${error.message}`);
  }
}

async function assertDuplicateHostRedirect(requestUrl, expectedUrl) {
  const response = await redirectDuplicateHost({
    request: new Request(requestUrl),
    next: () => {
      throw new Error(`Duplicate host was not redirected: ${requestUrl}`);
    },
  });

  if (response.status !== 301 || response.headers.get('location') !== expectedUrl) {
    throw new Error(
      `Unexpected duplicate host redirect: ${requestUrl} -> ${response.status} ${response.headers.get('location')}`,
    );
  }
}

async function assertCanonicalHostPassesThrough(requestUrl) {
  const expectedResponse = new Response('canonical host');
  const response = await redirectDuplicateHost({
    request: new Request(requestUrl),
    next: () => expectedResponse,
  });

  if (response !== expectedResponse) {
    throw new Error(`Canonical host should not redirect: ${requestUrl}`);
  }
}

const sitemap = readDistFile('sitemap.xml');
const robots = readDistFile('robots.txt');

assertIncludes(robots, `Sitemap: ${getSiteUrl('/sitemap.xml')}`, 'robots.txt');

for (const page of SEO_PAGES) {
  assertIncludes(sitemap, `<loc>${getSiteUrl(page.path)}</loc>`, 'sitemap.xml');
}

const htmlFiles = SEO_PAGES.map(({ path, basePath, language }) => [
  path === '/' ? 'index.html' : `${path.slice(1)}.html`,
  path, basePath, language,
]);

for (const [file, path, basePath, language] of htmlFiles) {
  const html = readDistFile(file);
  const url = getSiteUrl(path);

  assertNoForbidden(html, file);
  assertIncludes(html, `rel="canonical" href="${url}"`, file);
  assertIncludes(html, `property="og:url" content="${url}"`, file);
  assertIncludes(html, `property="og:image" content="${getSiteUrl('/og-image.png')}"`, file);
  assertIncludes(html, `name="twitter:image" content="${getSiteUrl('/og-image.png')}"`, file);
  assertIncludes(html, 'type="application/ld+json"', file);
  assertIncludes(html, `<html lang="${language === 'en' ? 'en-US' : 'zh-CN'}"`, file);
  for (const [lang, targetLanguage] of [['zh-Hans', 'zh'], ['en', 'en'], ['x-default', 'zh']]) {
    assertIncludes(html, `rel="alternate" hreflang="${lang}" href="${getSiteUrl(localizePath(basePath, targetLanguage))}"`, file);
  }
  if ((html.match(/rel="canonical"/g) || []).length !== 1) throw new Error(`${file} must have exactly one canonical`);
  if (/name="robots" content="[^"]*noindex/.test(html)) throw new Error(`${file} must be indexable`);

  if (language === 'en') {
    const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)?.[1];
    if (!h1 || /[\u3400-\u9fff]/.test(h1)) throw new Error(`${file} must render its English heading without JavaScript`);
    const languageLinks = /aria-label="(?:切换为中文|Switch to English)"/;
    for (const tag of html.matchAll(/<a\b[^>]*>/g)) {
      const href = tag[0].match(/href="([^"]*)"/)?.[1];
      if (href && localizePath(href, 'en') !== href && !languageLinks.test(tag[0])) {
        throw new Error(`${file} has a link that leaves English: ${href}`);
      }
    }
    for (const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      const schema = assertValidJson(match[1], file);
      function checkUrls(value) {
        if (typeof value === 'string' && value.startsWith(`${SITE_URL}/`)) {
          const relative = value.slice(SITE_URL.length);
          if (localizePath(relative, 'en') !== relative) throw new Error(`${file} has a Chinese schema URL: ${value}`);
        } else if (value && typeof value === 'object') Object.values(value).forEach(checkUrls);
      }
      checkUrls(schema);
    }
  }

  if (/rel="modulepreload"[^>]+compression-[^>]+\.js/.test(html)) {
    throw new Error(`${file} should not preload the image compression engine`);
  }

  const h1Count = (html.match(/<h1\b/g) || []).length;
  if (h1Count !== 1) {
    throw new Error(`${file} should contain exactly one h1, found ${h1Count}`);
  }

  if (basePath !== '/') {
    assertIncludes(html, '"@type":"BreadcrumbList"', file);
  }
}

const serviceWorker = readDistFile('sw.js');
if (/assets\/compression-[^"']+\.js/.test(serviceWorker)) {
  throw new Error('The image compression engine should not be precached');
}

assertNoForbidden(sitemap, 'sitemap.xml');
assertNoForbidden(robots, 'robots.txt');

const loaderManifests = readdirSync(DIST_DIR).filter((file) =>
  /^static-loader-data-manifest-.+\.json$/.test(file),
);

if (loaderManifests.length === 0) {
  throw new Error('Missing static loader data manifest');
}

for (const manifestFile of loaderManifests) {
  const manifest = assertValidJson(readDistFile(manifestFile), manifestFile);

  for (const [routePath, dataFile] of Object.entries(manifest)) {
    const data = readDistFile(dataFile);
    assertValidJson(data, `${manifestFile} -> ${routePath}`);
  }
}

await assertDuplicateHostRedirect(
  'https://image-tool-bk5.pages.dev/blog?source=google',
  'https://picthin.com/blog?source=google',
);
await assertDuplicateHostRedirect('https://www.picthin.com/', 'https://picthin.com/');
await assertCanonicalHostPassesThrough('https://picthin.com/blog');

console.log(`SEO check passed for ${SITE_URL}`);
