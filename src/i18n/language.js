export const LANGUAGE_KEY = 'picthin-language';

export function resolveLanguage(saved, languages = []) {
  if (saved === 'zh' || saved === 'en') return saved;
  for (const value of languages) {
    const base = String(value).toLowerCase().split(/[-_]/)[0];
    if (base === 'zh' || base === 'en') return base;
  }
  return 'en';
}

let selected;
let manualPreference;
const listeners = new Set();
let listening = false;
function readPreference() {
  try { return window.localStorage.getItem(LANGUAGE_KEY); } catch { return null; }
}
function detect() {
  return resolveLanguage(manualPreference ?? readPreference(), navigator.languages?.length ? navigator.languages : [navigator.language]);
}
export function getLanguage() {
  if (typeof window === 'undefined') return 'zh';
  return selected ??= detect();
}
function notify() { for (const listener of listeners) listener(); }
function syncPreference(event) {
  if (event.type === 'storage' && event.key !== LANGUAGE_KEY && event.key !== null) return;
  if (event.type === 'storage') manualPreference = undefined;
  selected = detect();
  notify();
}
export function subscribeLanguage(listener) {
  listeners.add(listener);
  if (!listening && typeof window !== 'undefined') {
    window.addEventListener('storage', syncPreference);
    window.addEventListener('languagechange', syncPreference);
    listening = true;
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && listening) {
      window.removeEventListener('storage', syncPreference);
      window.removeEventListener('languagechange', syncPreference);
      listening = false;
    }
  };
}
export function setLanguage(language) {
  if (!['zh', 'en'].includes(language)) return;
  manualPreference = language;
  selected = language;
  try { window.localStorage.setItem(LANGUAGE_KEY, language); } catch { /* Keep the choice in memory when storage is blocked. */ }
  notify();
}
