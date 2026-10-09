import LanguageSwitcher from '../components/LanguageSwitcher.jsx';
import { useI18n } from '../i18n/useI18n.js';
import { useEffect, useState } from 'react';
import { Head } from 'vite-react-ssg';
import { Link } from '../components/LocalizedLink.jsx';

const categories = { problem: '使用问题', suggestion: '功能建议', other: '其他反馈' };
const buttonClass = 'rounded-lg border border-border bg-surface px-3 py-2 text-sm hover:bg-surface-muted disabled:opacity-50';

export default function FeedbackAdmin() {
  const { t, locale } = useI18n();
  const [secret, setSecret] = useState('');
  const [token, setToken] = useState('');
  const [status, setStatus] = useState('new');
  const [cursors, setCursors] = useState([null]);
  const [items, setItems] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const before = cursors.at(-1);

  useEffect(() => {
    if (!token) return;
    const controller = new AbortController();
    async function load() {
      setBusy(true);
      setError('');
      setItems([]);
      setNextCursor(null);
      try {
        const params = new URLSearchParams({ status });
        if (before) params.set('before', before);
        const response = await fetch(`/api/admin/feedback?${params}`, {
          headers: { Authorization: `Bearer ${token}` }, cache: 'no-store',
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
        });
        const result = await response.json();
        if (response.status === 401) setToken('');
        if (!response.ok) throw new Error(result.error || '无法读取反馈。');
        setItems(result.items);
        setNextCursor(result.nextCursor);
      } catch (cause) {
        if (!controller.signal.aborted) setError(cause.message || '加载失败，请重试。');
      } finally {
        if (!controller.signal.aborted) setBusy(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [token, status, before, revision]);

  async function update(item, remove = false) {
    if (remove && !window.confirm('永久删除这条反馈及其邮箱？此操作无法撤销。')) return;
    setBusy(true);
    setError('');
    try {
      const response = await fetch('/api/admin/feedback', {
        method: remove ? 'DELETE' : 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(15000),
        body: JSON.stringify({ id: item.id, ...(!remove && { status: item.status === 'new' ? 'done' : 'new' }) }),
      });
      const result = await response.json();
      if (response.status === 401) { setToken(''); setItems([]); }
      if (!response.ok) throw new Error(result.error || '操作失败。');
      setRevision((value) => value + 1);
    } catch (cause) {
      setError(cause.message || '操作失败，请重试。');
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    setToken(''); setSecret(''); setItems([]); setCursors([null]); setNextCursor(null); setError('');
  }

  return <main className="min-h-screen bg-bg px-4 py-10 text-foreground">
    <Head><title>{t("反馈管理 - PicThin")}</title><meta name="robots" content="noindex,nofollow" /></Head>
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold">{t("反馈管理")}</h1><p className="mt-2 text-sm text-foreground-muted">{t("私密收件箱 · PicThin")}</p></div>
        <div className="flex flex-wrap items-center gap-3"><LanguageSwitcher /><Link to="/" className={buttonClass}>{t("返回网站")}</Link>{token && <button disabled={busy} onClick={logout} className={buttonClass}>{t("退出")}</button>}</div>
      </div>
      {!token ? <form className="space-y-4 rounded-xl border border-border bg-surface p-6" onSubmit={(event) => {
        event.preventDefault(); setError(''); setCursors([null]); setToken(secret.trim()); setSecret('');
      }}>
        <label className="block text-sm font-medium" htmlFor="admin-secret">{t("管理密钥")}</label>
        <input id="admin-secret" type="password" required minLength={32} maxLength={256} value={secret} autoComplete="off"
          onChange={(event) => setSecret(event.target.value)} className="w-full rounded-lg border border-border bg-bg px-3 py-3"
          placeholder={t("输入专属管理密钥")} />
        <p className="text-xs text-foreground-muted">{t("密钥只在当前页面内存中使用，刷新或退出后需要重新输入。")}</p>
        <button className="rounded-lg bg-primary px-5 py-2.5 text-primary-fg">{t("查看反馈")}</button>
      </form> : <>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2" role="group" aria-label={t("处理状态")}>
            {[['new', '待处理'], ['done', '已处理'], ['all', '全部']].map(([value, label]) => <button key={value} disabled={busy}
              aria-pressed={status === value} onClick={() => { setStatus(value); setCursors([null]); }}
              className={`${buttonClass} ${status === value ? 'border-primary text-primary' : ''}`}>{t(label)}</button>)}
          </div>
          <button disabled={busy} onClick={() => setRevision((value) => value + 1)} className={buttonClass}>{t("刷新")}</button>
        </div>
        {busy && <p role="status" className="mb-4 text-sm text-foreground-muted">{t("正在加载…")}</p>}
        {!busy && !error && items.length === 0 && <p className="rounded-xl border border-border bg-surface py-16 text-center text-foreground-muted">{t("这里暂时没有反馈。")}</p>}
        <div className="space-y-4">{items.map((item) => <article key={item.id} className="rounded-xl border border-border bg-surface p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-foreground-muted">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{t(categories[item.category])}</span>
            <time dateTime={new Date(item.created_at).toISOString()}>{t(new Date(item.created_at).toLocaleString(locale))}</time>
          </div>
          <p className="my-4 whitespace-pre-wrap break-words text-sm leading-7">{item.message}</p>
          <div className="space-y-1 break-all text-xs text-foreground-muted"><p>{t("来源页面：")}{t(item.page)}</p><p>{t("联系邮箱：")}{item.email || t('未填写')}</p></div>
          <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
            <span className="text-xs text-foreground-muted">{t(item.status === 'done' ? '已处理' : '待处理')}</span>
            <div className="flex gap-2"><button disabled={busy} onClick={() => update(item)} className={buttonClass}>{t(item.status === 'new' ? '标为已处理' : '恢复待处理')}</button>
              <button disabled={busy} onClick={() => update(item, true)} className={`${buttonClass} text-red-600`}>{t("删除")}</button></div>
          </div>
        </article>)}</div>
        <div className="mt-6 flex justify-between"><button disabled={busy || cursors.length === 1} className={buttonClass} onClick={() => setCursors((value) => value.slice(0, -1))}>{t("上一页")}</button>
          <button disabled={busy || !nextCursor} className={buttonClass} onClick={() => setCursors((value) => [...value, nextCursor])}>{t("下一页")}</button></div>
      </>}
      {error && <p role="alert" className="mt-5 text-sm text-red-600">{t(error)}</p>}
    </div>
  </main>;
}
