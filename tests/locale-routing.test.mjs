import test from 'node:test';
import assert from 'node:assert/strict';
import { SEO_PAGES } from '../src/config/content.js';
import { LOCALIZED_SEO_PAGES } from '../src/config/localizedPages.js';
import { getPathLanguage, getBasePath, isPublicPage, localizePath, localizeSchemaUrls } from '../src/i18n/paths.js';

test('every indexed page has a reversible English route with query and fragment preserved', () => {
  assert.equal(LOCALIZED_SEO_PAGES.length, SEO_PAGES.length * 2);
  assert.equal(new Set(LOCALIZED_SEO_PAGES.map(({ path }) => path)).size, SEO_PAGES.length * 2);
  for (const { path } of SEO_PAGES) {
    const english = localizePath(path, 'en');
    assert.equal(getPathLanguage(english), 'en');
    assert.equal(getBasePath(english), path);
    assert.equal(localizePath(`${english}?quality=80#result`, 'zh'), `${path}?quality=80#result`);
    assert.equal(localizePath(english, 'en'), english);
  }
  assert.equal(localizePath('/en/', 'en'), '/en');
  assert.deepEqual(localizePath({ pathname: '/tools', search: '?q=png', hash: '#tools' }, 'en'), { pathname: '/en/tools', search: '?q=png', hash: '#tools' });
});

test('locale routing never prefixes admin, API, asset, external or unknown URLs', () => {
  for (const path of ['/admin/feedback', '/api/feedback', '/img/demo/landscape.png', '/not-a-page', '/en/not-a-page', '//example.com/tools', 'https://example.com/tools', '#details']) {
    assert.equal(localizePath(path, 'en'), path);
  }
  assert.equal(isPublicPage('/en/admin/feedback'), false);
  assert.equal(getPathLanguage('/english'), 'zh');
});

test('structured data localizes public URLs without changing image assets or external references', () => {
  const input = { url: 'https://picthin.com/', image: 'https://picthin.com/og-image.png', items: [{ item: 'https://picthin.com/blog' }], reference: 'https://example.com/blog' };
  const result = localizeSchemaUrls(input, 'en', 'https://picthin.com');
  assert.equal(result.url, 'https://picthin.com/en');
  assert.equal(result.items[0].item, 'https://picthin.com/en/blog');
  assert.equal(result.image, input.image);
  assert.equal(result.reference, input.reference);
  assert.equal(input.url, 'https://picthin.com/');
});
