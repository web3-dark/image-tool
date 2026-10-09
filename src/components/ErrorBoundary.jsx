import React from 'react';
import { useI18n } from '../i18n/useI18n.js';

/**
 * 错误边界：捕获子组件的未处理异常，展示友好的降级 UI
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}

function ErrorFallback() {
  const { t } = useI18n();
  return (
        <div className="flex flex-col items-center justify-center h-screen gap-6 p-8 bg-bg">
          <svg className="w-16 h-16 text-foreground-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
          </svg>
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground mb-2">{t('页面出错了')}</h1>
            <p className="text-sm text-foreground-muted max-w-sm">
              {t('页面暂时无法正常显示，请检查网络后刷新重试。')}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-primary-fg rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
          >
            {t('刷新页面')}
          </button>
        </div>
      );
}

export default ErrorBoundary;
