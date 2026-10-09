import { useI18n } from '../i18n/useI18n.js';
import { Link } from './LocalizedLink.jsx';
import PrivacyPolicy from './PrivacyPolicy';
import FeedbackButton from './FeedbackButton.jsx';
import SiteHeader from './SiteHeader.jsx';
import { useState } from 'react';

export default function BlogLayout({ children }) {
  const { t } = useI18n();
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full bg-bg">
      <SiteHeader />

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className="flex-shrink-0 border-t border-border bg-surface px-8 py-6">
        <div className="flex flex-col items-center gap-3 text-sm text-foreground-muted max-w-4xl mx-auto">
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label={t("页脚导航")}>
            <Link to="/" className="hover:text-primary">{t("在线图片压缩")}</Link>
            <Link to="/tools" className="hover:text-primary">{t("全部图片工具")}</Link>
            <Link to="/compress-image-to-size" className="hover:text-primary">{t("压缩到指定大小")}</Link>
            <Link to="/compress-image-to-100kb" className="hover:text-primary">{t("压缩到 100KB")}</Link>
            <Link to="/remove-image-metadata" className="hover:text-primary">{t("清除照片位置")}</Link>
            <Link to="/about" className="hover:text-primary">{t("关于 PicThin")}</Link>
          </nav>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <span>{t("图片仅在本地处理，不上传服务器，隐私安全有保障")}</span>
            <span className="hidden md:inline w-px h-4 bg-border" aria-hidden="true" />
            <button
              onClick={() => setPrivacyOpen(true)}
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >{t("隐私政策")}</button>
            <FeedbackButton />
          </div>
        </div>
      </footer>

      <PrivacyPolicy isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}
