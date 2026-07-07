#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { SEO_PAGES } from '../src/config/content.js';

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

const sitemap = readDistFile('sitemap.xml');
const robots = readDistFile('robots.txt');

assertIncludes(robots, `Sitemap: ${getSiteUrl('/sitemap.xml')}`, 'robots.txt');

for (const page of SEO_PAGES) {
  assertIncludes(sitemap, `<loc>${getSiteUrl(page.path)}</loc>`, 'sitemap.xml');
}

const htmlFiles = [
  ['index.html', '/'],
  ['blog.html', '/blog'],
  ['blog/jpg-compress-to-target-size.html', '/blog/jpg-compress-to-target-size'],
  ['blog/png-webp-jpg-comparison.html', '/blog/png-webp-jpg-comparison'],
];

for (const [file, path] of htmlFiles) {
  const html = readDistFile(file);
  const url = getSiteUrl(path);

  assertNoForbidden(html, file);
  assertIncludes(html, `rel="canonical" href="${url}"`, file);
  assertIncludes(html, `property="og:url" content="${url}"`, file);
  assertIncludes(html, `property="og:image" content="${getSiteUrl('/og-image.png')}"`, file);
  assertIncludes(html, `name="twitter:image" content="${getSiteUrl('/og-image.png')}"`, file);
  assertIncludes(html, 'type="application/ld+json"', file);
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

console.log(`SEO check passed for ${SITE_URL}`);
