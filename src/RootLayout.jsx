import { StrictMode, useEffect } from 'react';
import { Head } from 'vite-react-ssg';
import { useI18n } from './i18n/useI18n.js';
import { Outlet, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PrivacyAnalytics from './components/PrivacyAnalytics.jsx';
import AppUpdateNotice from './components/AppUpdateNotice.jsx';
import { getSiteUrl } from './config/site.js';
import { isPublicPage, localizePath } from './i18n/paths.js';

export default function RootLayout() {
  const { locale, language, t } = useI18n();
  useEffect(() => {
    document.querySelector('link[rel="manifest"]')?.setAttribute('href',
      language === 'en' ? '/manifest.en.webmanifest' : '/manifest.webmanifest');
  }, [language]);
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin/');
  return (
    <StrictMode>
      <ErrorBoundary>
        <Head>
          <html lang={locale} />
          <meta property="og:site_name" content="PicThin" />
          {pathname === '/' && <script type="application/ld+json">{JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: 'PicThin',
            alternateName: 'picthin.com',
            url: getSiteUrl('/'),
            inLanguage: ['zh-CN', 'en-US'],
          })}</script>}
          <meta property="og:locale" content={language === 'en' ? 'en_US' : 'zh_CN'} />
          <meta name="apple-mobile-web-app-title" content={t('图片压缩')} />
          {isPublicPage(pathname) && <>
            <link rel="alternate" hrefLang="zh-Hans" href={getSiteUrl(localizePath(pathname, 'zh'))} />
            <link rel="alternate" hrefLang="en" href={getSiteUrl(localizePath(pathname, 'en'))} />
            <link rel="alternate" hrefLang="x-default" href={getSiteUrl(localizePath(pathname, 'zh'))} />
          </>}
        </Head>
        {!isAdmin && <PrivacyAnalytics />}
        {!isAdmin && <AppUpdateNotice />}
        <Outlet />
      </ErrorBoundary>
    </StrictMode>
  );
}
