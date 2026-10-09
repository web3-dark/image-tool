import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.js';
import { localizePath } from '../i18n/paths.js';

export default function LanguageSuggestion() {
  const { language, preferredLanguage, setLanguage } = useI18n();
  const { pathname, search, hash } = useLocation();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || !preferredLanguage || preferredLanguage === language) return null;
  const english = preferredLanguage === 'en';
  return (
    <aside lang={english ? 'en' : 'zh-CN'} className="shrink-0 border-b border-border bg-primary-muted px-4 py-2 text-sm text-foreground">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
        <p>{english ? 'Prefer English?' : '使用中文版？'}{' '}
          <a href={localizePath(`${pathname}${search}${hash}`, preferredLanguage)}
            onClick={(event) => {
              if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
              event.preventDefault(); setLanguage(preferredLanguage);
            }} className="font-medium text-primary underline underline-offset-2">
            {english ? 'Continue in English' : '切换为中文'}
          </a>
        </p>
        <button type="button" onClick={() => setDismissed(true)} aria-label={english ? 'Dismiss language suggestion' : '关闭语言提示'}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md hover:bg-surface"><X size={16} /></button>
      </div>
    </aside>
  );
}
