import { StrictMode } from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PrivacyAnalytics from './components/PrivacyAnalytics.jsx';
import AppUpdateNotice from './components/AppUpdateNotice.jsx';

export default function RootLayout() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <PrivacyAnalytics />
        <AppUpdateNotice />
        <Outlet />
      </ErrorBoundary>
    </StrictMode>
  );
}
