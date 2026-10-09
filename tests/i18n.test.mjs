import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolveLanguage } from '../src/i18n/language.js';
import { translate, translateData } from '../src/i18n/translate.js';

test('language selection respects manual choice and ordered supported browser languages', () => {
  assert.equal(resolveLanguage('zh', ['en-US']), 'zh');
  assert.equal(resolveLanguage('en', ['zh-CN']), 'en');
  assert.equal(resolveLanguage(null, ['zh-Hant-TW', 'en-US']), 'zh');
  assert.equal(resolveLanguage(null, ['en-GB', 'zh-CN']), 'en');
  assert.equal(resolveLanguage('invalid', ['fr-FR', 'zh-TW']), 'zh');
  assert.equal(resolveLanguage(null, ['fr-FR']), 'en');
  assert.equal(resolveLanguage(null, []), 'en');
});

test('English catalog preserves interpolation fields and contains only English translations', () => {
  const catalog = JSON.parse(readFileSync(new URL('../src/i18n/en.json', import.meta.url)));
  for (const [source, english] of Object.entries(catalog)) {
    assert.ok(english.trim(), source);
    assert.deepEqual([...source.matchAll(/\{\d+\}/g)].map(m => m[0]).sort(), [...english.matchAll(/\{\d+\}/g)].map(m => m[0]).sort(), source);
    assert.ok(!/[\u4e00-\u9fff]/.test(english), source);
  }
});

test('translation supports dynamic messages while leaving unknown data unchanged', () => {
  assert.equal(translate('图片压缩', 'en'), 'Compress images');
  assert.equal(translate('图片压缩', 'zh'), '图片压缩');
  assert.equal(translate('我的照片.png', 'en'), '我的照片.png');
  assert.equal(translate(42, 'en'), 42);
  const catalog = JSON.parse(readFileSync(new URL('../src/i18n/en.json', import.meta.url)));
  const [source, expected] = Object.entries(catalog).find(([key]) => key.includes('{0}') && !key.includes('{1}'));
  assert.equal(translate(source, 'en', [27]).trim(), expected.replaceAll('{0}', '27').trim());
  assert.equal(translate(source.replaceAll('{0}', '27'), 'en').trim(), expected.replaceAll('{0}', '27').trim());
  assert.deepEqual(translateData({ inLanguage: 'zh-CN', name: '图片压缩' }, 'en'), { inLanguage: 'en', name: 'Compress images' });
});

test('manual choice survives blocked storage; browser and other-tab changes are observed with cleanup', async () => {
  const windowDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'window');
  const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
  const handlers = new Map();
  let languages = ['zh-CN'];
  Object.defineProperty(globalThis, 'window', { configurable: true, value: {
    localStorage: { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } },
    addEventListener(name, fn) { handlers.set(name, fn); },
    removeEventListener(name) { handlers.delete(name); },
  }});
  Object.defineProperty(globalThis, 'navigator', { configurable: true, get: () => ({ languages }) });
  try {
    const store = await import('../src/i18n/language.js?test=blocked');
    assert.equal(store.getLanguage(), 'zh');
    let calls = 0;
    const unsubscribe = store.subscribeLanguage(() => calls++);
    languages = ['en-US'];
    handlers.get('languagechange')({ type: 'languagechange' });
    assert.equal(store.getLanguage(), 'en');
    store.setLanguage('zh');
    handlers.get('languagechange')({ type: 'languagechange' });
    assert.equal(store.getLanguage(), 'zh');
    store.setLanguage('invalid');
    assert.equal(store.getLanguage(), 'zh');
    window.localStorage.getItem = () => 'en';
    handlers.get('storage')({ type: 'storage', key: store.LANGUAGE_KEY });
    assert.equal(store.getLanguage(), 'en');
    assert.equal(calls, 4);
    unsubscribe();
    assert.equal(handlers.size, 0);
  } finally {
    if (windowDescriptor) Object.defineProperty(globalThis, 'window', windowDescriptor); else delete globalThis.window;
    if (navigatorDescriptor) Object.defineProperty(globalThis, 'navigator', navigatorDescriptor); else delete globalThis.navigator;
  }
});
