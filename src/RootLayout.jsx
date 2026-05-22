import { StrictMode } from 'react';
import { Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary.jsx';

export default function RootLayout() {
  return (
    <StrictMode>
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </StrictMode>
  );
}
