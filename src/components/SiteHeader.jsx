import { Link, NavLink } from './LocalizedLink.jsx';
import { useI18n } from '../i18n/useI18n.js';
import { Logo } from './Logo';
import LanguageSwitcher from './LanguageSwitcher.jsx';
import LanguageSuggestion from './LanguageSuggestion.jsx';

const NAVIGATION = [
  { to: '/', zh: '图片压缩', en: 'Compress' },
  { to: '/tools', zh: '全部工具', en: 'Tools' },
  { to: '/blog', zh: '使用指南', en: 'Guides' },
];

export default function SiteHeader() {
  const { language } = useI18n();

  return (
    <header className="sticky top-0 z-50 shrink-0 border-b border-border bg-surface">
      <div className="px-4 md:px-8">
      <div className="mx-auto grid h-28 w-full max-w-6xl grid-cols-[128px_minmax(0,1fr)_144px] grid-rows-[64px_48px] items-center sm:h-[72px] sm:grid-rows-1 sm:gap-x-4">
        <Link to="/" aria-label="PicThin" className="col-start-1 row-start-1 w-32 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary">
          <Logo size="sm" showText />
        </Link>
        <nav aria-label={language === 'en' ? 'Main navigation' : '主导航'}
          className="col-span-3 col-start-1 row-start-2 grid h-12 grid-cols-3 items-center sm:col-span-1 sm:col-start-2 sm:row-start-1 sm:w-60 sm:justify-self-end">
          {NAVIGATION.map(({ to, ...labels }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) => `flex h-11 items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${isActive ? 'text-primary bg-primary-muted' : 'text-foreground-muted hover:bg-surface-muted hover:text-foreground'}`}
            >{labels[language]}</NavLink>
          ))}
        </nav>
        <div className="col-start-3 row-start-1 justify-self-end">
          <LanguageSwitcher />
        </div>
      </div>
      </div>
      <LanguageSuggestion />
    </header>
  );
}
