import { useI18n } from '../i18n/useI18n.js';
import { useEffect, useState } from 'react';

export default function AppUpdateNotice() {
  const { t } = useI18n();
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    const onPreloadError = (event) => {
      event.preventDefault();
      setUpdateAvailable(true);
    };
    window.addEventListener('vite:preloadError', onPreloadError);
    if (!import.meta.env.PROD || !('serviceWorker' in navigator)) {
      return () => window.removeEventListener('vite:preloadError', onPreloadError);
    }

    let hadController = Boolean(navigator.serviceWorker.controller);
    let registration;
    let disposed = false;
    const onControllerChange = () => {
      if (hadController) setUpdateAvailable(true);
      hadController = true;
    };
    const checkForUpdate = () => { registration?.update().catch(() => {}); };
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    window.addEventListener('online', checkForUpdate);
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .then((value) => {
        if (disposed) return;
        registration = value;
        checkForUpdate();
      })
      .catch(() => {}); // Offline or unsupported storage must not block the tool.

    return () => {
      disposed = true;
      navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
      window.removeEventListener('online', checkForUpdate);
      window.removeEventListener('vite:preloadError', onPreloadError);
    };
  }, []);

  if (!updateAvailable) return null;
  return (
    <div role="status" className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg rounded-xl border border-border bg-surface p-4 shadow-lg">
      <p className="text-sm text-foreground">{t("有新版本可用。请先下载当前图片，再刷新页面。")}</p>
      <div className="mt-3 flex gap-4 text-sm">
        <button className="font-semibold text-primary" onClick={() => window.location.reload()}>{t("刷新页面")}</button>
        <button className="text-foreground-muted" onClick={() => setUpdateAvailable(false)}>{t("稍后再说")}</button>
      </div>
    </div>
  );
}
