import { StrictMode, useEffect } from 'react';
import { Head } from 'vite-react-ssg';
import { useI18n } from './i18n/useI18n.js';
import { Outlet, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PrivacyAnalytics from './components/PrivacyAnalytics.jsx';
import AppUpdateNotice from './components/AppUpdateNotice.jsx';

export default function RootLayout() {
  const { locale, language, t } = useI18n();
  useEffect(() => {
    document.querySelector('link[rel="manifest"]')?.setAttribute('href',
      language === 'en' ? '/manifest.en.webmanifest' : '/manifest.webmanifest');
  }, [language]);
  const isAdmin = useLocation().pathname.startsWith('/admin/');
  return (
    <StrictMode>
      <ErrorBoundary>
        <Head>
          <html lang={locale} />
          <meta property="og:locale" content={language === 'en' ? 'en_US' : 'zh_CN'} />
          <meta name="apple-mobile-web-app-title" content={t('图片压缩')} />
        </Head>
        {!isAdmin && <PrivacyAnalytics />}
        {!isAdmin && <AppUpdateNotice />}
        <Outlet />
      </ErrorBoundary>
    </StrictMode>
  );
}
