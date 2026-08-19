import { Link } from 'react-router-dom';
import { Logo } from './Logo';
import PrivacyPolicy from './PrivacyPolicy';
import { useState } from 'react';

export default function BlogLayout({ children }) {
  const [privacyOpen, setPrivacyOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full bg-bg">
      <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur supports-[backdrop-filter]:bg-surface/75 px-4 md:px-8 py-2">
        <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
          <Link to="/" className="block">
            <Logo size="sm" showText={true} />
          </Link>
          <nav className="flex items-center gap-5 text-sm">
            <Link to="/" className="text-foreground-muted hover:text-primary transition-colors">
              图片压缩
            </Link>
            <Link to="/tools" className="text-foreground-muted hover:text-primary transition-colors">
              工具
            </Link>
            <Link to="/blog" className="text-foreground hover:text-primary font-medium transition-colors">
              指南
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full">
        {children}
      </main>

      <footer className="flex-shrink-0 border-t border-border bg-surface px-8 py-6">
        <div className="flex flex-col items-center gap-3 text-sm text-foreground-muted max-w-4xl mx-auto">
          <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2" aria-label="页脚导航">
            <Link to="/" className="hover:text-primary">在线图片压缩</Link>
            <Link to="/tools" className="hover:text-primary">全部图片工具</Link>
            <Link to="/compress-image-to-size" className="hover:text-primary">压缩到指定大小</Link>
            <Link to="/compress-jpg" className="hover:text-primary">JPG 压缩</Link>
            <Link to="/png-to-webp" className="hover:text-primary">PNG 转 WebP</Link>
            <Link to="/about" className="hover:text-primary">关于 PicThin</Link>
          </nav>
          <div className="flex flex-col md:flex-row items-center justify-center gap-3">
            <span>图片仅在本地处理，不上传服务器，隐私安全有保障</span>
            <span className="hidden md:inline w-px h-4 bg-border" aria-hidden="true" />
            <button
              onClick={() => setPrivacyOpen(true)}
              className="underline underline-offset-2 hover:text-primary transition-colors"
            >
              隐私政策
            </button>
          </div>
        </div>
      </footer>

      <PrivacyPolicy isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}
