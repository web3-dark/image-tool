import { useSyncExternalStore } from 'react';
import { getLanguage, setLanguage, subscribeLanguage } from './language.js';
import { translate, translateData } from './translate.js';

const values = Object.fromEntries(['zh', 'en'].map((language) => [language, {
  language,
  locale: language === 'en' ? 'en-US' : 'zh-CN',
  setLanguage,
  t: (text, variables) => translate(text, language, variables),
  localize: (data) => translateData(data, language),
}]));
export function useI18n() {
  const language = useSyncExternalStore(subscribeLanguage, getLanguage, () => 'zh');
  return values[language];
}
