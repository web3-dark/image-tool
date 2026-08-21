import { StrictMode } from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import PrivacyAnalytics from './components/PrivacyAnalytics.jsx';

export default function RootLayout() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <PrivacyAnalytics />
        <Outlet />
      </ErrorBoundary>
    </StrictMode>
  );
}
