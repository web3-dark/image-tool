import { Languages } from 'lucide-react';
import { useI18n } from '../i18n/useI18n.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useI18n();
  return (
    <Select value={language} onValueChange={setLanguage}>
      <SelectTrigger aria-label="Language / 语言" className="w-36 shrink-0">
        <span className="flex items-center gap-2">
          <Languages size={16} className="shrink-0 text-foreground-muted" aria-hidden="true" />
          <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="zh"><span lang="zh-CN">中文</span></SelectItem>
        <SelectItem value="en"><span lang="en">English</span></SelectItem>
      </SelectContent>
    </Select>
  );
}
