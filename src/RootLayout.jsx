import { StrictMode } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PrivacyAnalytics from './components/PrivacyAnalytics.jsx';
import AppUpdateNotice from './components/AppUpdateNotice.jsx';

export default function RootLayout() {
  const isAdmin = useLocation().pathname.startsWith('/admin/');
  return (
    <StrictMode>
      <ErrorBoundary>
        {!isAdmin && <PrivacyAnalytics />}
        {!isAdmin && <AppUpdateNotice />}
        <Outlet />
      </ErrorBoundary>
    </StrictMode>
  );
}
