#!/usr/bin/env node

import { SEO_PAGES } from '../src/config/content.js';

const DEFAULT_SITE_URL = 'https://picthin.com';
const API_URL = 'http://data.zz.baidu.com/urls';

function normalizeSiteUrl(siteUrl) {
  return siteUrl.replace(/\/+$/, '');
}

function getSiteUrl(path, siteUrl) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl}${normalizedPath}`;
}

function getBaiduSiteParam(siteUrl) {
  return process.env.BAIDU_PUSH_SITE || new URL(siteUrl).hostname;
}

function parseArgs(argv) {
  return {
    dryRun: argv.includes('--dry-run'),
    urls: argv
      .filter((arg) => arg.startsWith('--url='))
      .map((arg) => arg.slice('--url='.length))
      .filter(Boolean),
  };
}

function buildDefaultUrls(siteUrl) {
  return SEO_PAGES.map((page) => getSiteUrl(page.path, siteUrl));
}

async function pushUrls({ baiduSite, token, urls }) {
  const endpoint = `${API_URL}?site=${encodeURIComponent(baiduSite)}&token=${encodeURIComponent(token)}`;
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain',
    },
    body: `${urls.join('\n')}\n`,
  });

  const text = await response.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  if (!response.ok) {
    throw new Error(`Baidu push failed with HTTP ${response.status}: ${text}`);
  }

  return data;
}

const { dryRun, urls: explicitUrls } = parseArgs(process.argv.slice(2));
const siteUrl = normalizeSiteUrl(process.env.SITE_URL || process.env.VITE_SITE_URL || DEFAULT_SITE_URL);
const baiduSite = getBaiduSiteParam(siteUrl);
const token = process.env.BAIDU_PUSH_TOKEN;
const urls = explicitUrls.length > 0 ? explicitUrls : buildDefaultUrls(siteUrl);

if (urls.length === 0) {
  throw new Error('No URLs to push.');
}

if (dryRun) {
  console.log(`Baidu push dry run for ${siteUrl} (site=${baiduSite}):`);
  console.log(urls.join('\n'));
  process.exit(0);
}

if (!token) {
  throw new Error('Missing BAIDU_PUSH_TOKEN. Example: BAIDU_PUSH_TOKEN=xxx npm run seo:baidu:push');
}

const result = await pushUrls({ baiduSite, token, urls });

console.log(JSON.stringify(result, null, 2));
