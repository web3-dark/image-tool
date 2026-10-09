import { useI18n } from '../i18n/useI18n.js';
import { isRouteErrorResponse, useRouteError } from 'react-router-dom';

export default function RouteErrorPage() {
  const { t } = useI18n();
  const error = useRouteError();
  const notFound = isRouteErrorResponse(error) && error.status === 404;
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-bg px-6 text-center text-foreground">
      <h1 className="text-2xl font-semibold">{t(notFound ? '页面不存在' : '页面暂时无法打开')}</h1>
      <p className="max-w-md text-sm leading-6 text-foreground-muted">
        {t(notFound ? '链接可能已经变更，你可以返回首页继续使用图片工具。' : '可能是网络中断或网站刚刚更新。请检查网络后重新打开页面。')}
      </p>
      <div className="flex gap-4 text-sm">
        <button type="button" onClick={() => window.location.reload()} className="rounded-lg bg-primary px-5 py-3 text-primary-fg">{t("重新打开")}</button>
        <a href="/" className="rounded-lg border border-border px-5 py-3">{t("返回首页")}</a>
      </div>
    </main>
  );
}
