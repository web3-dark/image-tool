import english from './en.json' with { type: 'json' };

const normalize = (value) => value.replace(/\s+/g, ' ').trim();
const dynamicMessages = Object.entries(english).filter(([key]) => /\{\d+\}/.test(key)).map(([key, value]) => {
  const fields = [...key.matchAll(/\{(\d+)\}/g)].map((match) => Number(match[1]));
  const pattern = key.split(/\{\d+\}/).map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('(.+?)');
  return { pattern: new RegExp(`^${pattern}$`), fields, value };
});

export function translate(value, language, variables = []) {
  if (typeof value !== 'string') return value;
  const key = normalize(value);
  let result = value;
  if (language === 'en') {
    if (Object.hasOwn(english, key)) result = english[key];
    else {
      for (const entry of dynamicMessages) {
        const match = key.match(entry.pattern);
        if (!match) continue;
        result = entry.value.replace(/\{(\d+)\}/g, (_, index) => match[entry.fields.indexOf(Number(index)) + 1]);
        break;
      }
    }
  }
  return result.replace(/\{(\d+)\}/g, (placeholder, index) => variables[index] === undefined ? placeholder : String(variables[index]));
}

// Only use with app-owned configuration/schema data, never user input or files.
export function translateData(value, language) {
  if (typeof value === 'string') return translate(value, language);
  if (Array.isArray(value)) return value.map((item) => translateData(item, language));
  if (value && Object.getPrototypeOf(value) === Object.prototype) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key,
      key === 'inLanguage' ? (language === 'en' ? 'en' : 'zh-CN') : translateData(item, language)]));
  }
  return value;
}
