import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useI18n } from '../i18n/useI18n.js';
import { localizePath } from '../i18n/paths.js';

const LANGUAGES = [
  { value: 'zh', label: '中文', lang: 'zh-CN', action: '切换为中文', announcement: '已切换为中文' },
  { value: 'en', label: 'English', lang: 'en', action: 'Switch to English', announcement: 'Language set to English' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  const location = useLocation();
  const [announcement, setAnnouncement] = useState('');

  function selectLanguage(option) {
    setLanguage(option.value);
    if (option.value === language) return;
    setAnnouncement(option.announcement);
  }

  return (
    <div className="w-36 shrink-0">
      <div role="group" aria-label="Language / 语言"
        className="grid w-full grid-cols-2 items-center gap-1 rounded-lg border border-border bg-surface-muted p-1">
        {LANGUAGES.map((option) => (
          <a key={option.value} lang={option.lang} href={localizePath(`${location.pathname}${location.search}${location.hash}`, option.value)}
            hrefLang={option.lang} aria-label={option.action} aria-current={language === option.value ? 'true' : undefined}
            onClick={(event) => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault();
              selectLanguage(option);
            }}
            className={`flex h-11 min-w-0 items-center justify-center whitespace-nowrap rounded-md px-2 text-sm font-medium outline-none transition-[color,background-color,box-shadow] duration-fast focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted motion-reduce:transition-none ${
              language === option.value
                ? 'bg-surface text-primary-hover shadow-sm'
                : 'text-foreground-muted hover:bg-surface/70 hover:text-foreground'
            }`}
          >{option.label}</a>
        ))}
      </div>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
    </div>
  );
}
