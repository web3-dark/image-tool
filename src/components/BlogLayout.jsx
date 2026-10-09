import { useI18n } from '../i18n/useI18n.js';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import PrivacyPolicy from './PrivacyPolicy';
import FeedbackButton from './FeedbackButton.jsx';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import { useState } from 'react';

export default function BlogLayout({ children }) {
  const { t } = useI18n();
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full bg-bg">
      <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75 px-4 md:px-8 py-2">
        <div className="flex flex-wrap items-center justify-between gap-3 max-w-4xl mx-auto w-full">
          <Link to="/" className="block">
            <Logo size="sm" showText={true} />
          </Link>
          <nav className="ml-auto flex flex-wrap items-center gap-3 text-sm">
            <Link to="/" className="text-foreground-muted hover:text-primary transition-colors">{t("图片压缩")}</Link>
            <Link to="/tools" className="text-foreground-muted hover:text-primary transition-colors">{t("工具")}</Link>
            <Link to="/blog" className="text-foreground hover:text-primary font-medium transition-colors">{t("指南")}</Link>
            <LanguageSwitcher />
          </nav>
        </div>
      </header>

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
