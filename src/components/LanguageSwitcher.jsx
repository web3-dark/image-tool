import { useState } from 'react';
import { useI18n } from '../i18n/useI18n.js';

const LANGUAGES = [
  { value: 'zh', label: '中文', lang: 'zh-CN', action: '切换为中文', announcement: '已切换为中文' },
  { value: 'en', label: 'English', lang: 'en', action: 'Switch to English', announcement: 'Language set to English' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  const [announcement, setAnnouncement] = useState('');

  function selectLanguage(option) {
    if (option.value === language) return;
    setLanguage(option.value);
    setAnnouncement(option.announcement);
  }

  return (
    <div className="w-36 shrink-0">
      <div role="group" aria-label="Language / 语言"
        className="grid w-full grid-cols-2 items-center gap-1 rounded-lg border border-border bg-surface-muted p-1">
        {LANGUAGES.map((option) => (
          <button key={option.value} type="button" lang={option.lang}
            aria-label={option.action} aria-pressed={language === option.value}
            onClick={() => selectLanguage(option)}
            className={`flex h-11 min-w-0 items-center justify-center whitespace-nowrap rounded-md px-2 text-sm font-medium outline-none transition-[color,background-color,box-shadow] duration-fast focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface-muted motion-reduce:transition-none ${
              language === option.value
                ? 'bg-surface text-primary-hover shadow-sm'
                : 'text-foreground-muted hover:bg-surface/70 hover:text-foreground'
            }`}
          >{option.label}</button>
        ))}
      </div>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
    </div>
  );
}
