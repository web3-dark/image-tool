import { useCallback, useSyncExternalStore } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getLanguage, setLanguage as rememberLanguage, subscribeLanguage } from './language.js';
import { translate, translateData } from './translate.js';
import { getPathLanguage, localizePath, localizeSchemaUrls } from './paths.js';
import { SITE_URL } from '../config/site.js';

const values = Object.fromEntries(['zh', 'en'].map((language) => [language, {
  language,
  locale: language === 'en' ? 'en-US' : 'zh-CN',
  t: (text, variables) => translate(text, language, variables),
  path: (target) => localizePath(target, language),
  localize: (data) => localizeSchemaUrls(translateData(data, language), language, SITE_URL),
}]));
export function useI18n() {
  const location = useLocation();
  const navigate = useNavigate();
  const preferredLanguage = useSyncExternalStore(subscribeLanguage, getLanguage, () => null);
  const isAdmin = location.pathname.startsWith('/admin/');
  const language = isAdmin ? preferredLanguage || 'zh' : getPathLanguage(location.pathname);
  const setLanguage = useCallback((nextLanguage) => {
    if (!['zh', 'en'].includes(nextLanguage)) return;
    rememberLanguage(nextLanguage);
    if (!isAdmin) navigate(localizePath(`${location.pathname}${location.search}${location.hash}`, nextLanguage), { preventScrollReset: true });
  }, [isAdmin, location.pathname, location.search, location.hash, navigate]);
  return { ...values[language], preferredLanguage, setLanguage };
}
