import { useI18n } from '../i18n/useI18n.js';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, LoaderCircle, LockKeyhole, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.jsx';
import { loadTurnstile } from '../utils/turnstile.js';

const inputClass = 'w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40';

export default function FeedbackDialog({ onClose }) {
  const { t, language } = useI18n();
  const dialog = useRef(null);
  const widgetContainer = useRef(null);
  const widget = useRef(null);
  const submissionId = useRef(null);
  const [token, setToken] = useState('');
  const [category, setCategory] = useState('problem');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const element = dialog.current;
    element.showModal();
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = overflow; };
  }, []);

  useEffect(() => {
    if (sent) return;
    let disposed = false;
    const controller = new AbortController();
    async function prepare() {
      setToken('');
      try {
        const response = await fetch('/api/feedback-config', {
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]), cache: 'no-store',
        });
        if (!response.ok) throw new Error('反馈功能暂时不可用，请稍后再试。');
        const config = await response.json();
        if (!config.enabled || !config.siteKey) throw new Error('反馈功能暂时不可用，请稍后再试。');
        const turnstile = await loadTurnstile();
        if (disposed) return;
        widget.current = turnstile.render(widgetContainer.current, {
          sitekey: config.siteKey,
          action: 'feedback',
          theme: 'light',
          language: language === 'en' ? 'en' : 'zh-cn',
          size: 'flexible',
          callback: (value) => { setToken(value); setVerificationError(''); },
          'expired-callback': () => setToken(''),
          'error-callback': () => { setToken(''); setVerificationError('验证暂时失败，请重试或检查网络。'); },
          'timeout-callback': () => { setToken(''); setVerificationError('验证超时，请重新验证。'); },
        });
      } catch (cause) {
        if (!disposed) setVerificationError(cause.name === 'TimeoutError'
          ? '连接反馈服务超时，请稍后重试。'
          : cause instanceof SyntaxError ? '反馈功能暂时不可用，请稍后再试。'
          : cause instanceof TypeError ? '连接失败，请检查网络后重试。' : cause.message || '验证服务加载失败，请重试。');
      }
    }
    void prepare();
    return () => {
      disposed = true;
      controller.abort();
      if (widget.current !== null) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [attempt, sent, language]);

  async function submit(event) {
    event.preventDefault();
    if (busy || !token) return;
    setError('');
    setBusy(true);
    const fingerprint = JSON.stringify([category, message.trim(), email.trim(), window.location.pathname]);
    if (submissionId.current?.fingerprint !== fingerprint) {
      submissionId.current = { id: crypto.randomUUID(), fingerprint };
    }
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(20000),
        body: JSON.stringify({
          submissionId: submissionId.current.id, category, message: message.trim(), email: email.trim(),
          page: window.location.pathname, token,
          website: new FormData(event.target).get('website') || '',
        }),
      });
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error(result.error || '提交失败，请稍后重试。');
      setSent(true);
    } catch (cause) {
      setError(cause.name === 'TimeoutError' || cause instanceof TypeError
        ? '暂时无法确认提交结果，内容已保留。请重新验证后重试，不会重复保存。'
        : cause instanceof SyntaxError ? '提交失败，内容已保留，请重试。'
        : cause.message || '提交失败，内容已保留，请重试。');
    } finally {
      setBusy(false);
      setToken('');
      if (widget.current !== null) window.turnstile?.reset(widget.current);
    }
  }

  return createPortal(
    <dialog ref={dialog} aria-labelledby="feedback-title"
      onCancel={(event) => { event.preventDefault(); if (!busy) onClose(); }}
      className="m-auto w-[calc(100%_-_2rem)] max-w-lg max-h-[90dvh] overflow-y-auto rounded-2xl border border-border bg-surface p-0 text-foreground shadow-xl backdrop:bg-black/40 backdrop:backdrop-blur-sm">
      <div className="flex items-start justify-between border-b border-border p-5 sm:p-6">
        <div>
          <h2 id="feedback-title" className="text-xl font-semibold">{t("意见反馈")}</h2>
          <p className="mt-1 text-sm text-foreground-muted">{t("遇到问题，或有想要的功能？告诉我们。")}</p>
        </div>
        <button type="button" aria-label={t("关闭反馈")} disabled={busy} onClick={onClose}
          className="rounded-lg p-2 hover:bg-surface-muted disabled:opacity-40"><X size={20} /></button>
      </div>
      {sent ? <div className="p-8 text-center" role="status">
        <CheckCircle2 className="mx-auto mb-4 text-primary" size={40} />
        <h3 className="text-lg font-semibold">{t("反馈已收到，谢谢你！")}</h3>
        <p className="mt-2 text-sm text-foreground-muted">{t("我们会认真查看。若留下了邮箱，需要进一步了解时会与你联系。")}</p>
        <button type="button" onClick={onClose} className="mt-6 rounded-lg bg-primary px-8 py-2.5 text-primary-fg">{t("完成")}</button>
      </div> : <form onSubmit={submit} className="space-y-4 p-5 sm:p-6">
        <fieldset disabled={busy} className="space-y-4 disabled:opacity-70">
          <div className="space-y-1.5">
            <label htmlFor="feedback-category" className="block text-sm font-medium">{t("反馈类型")}</label>
            <Select value={category} onValueChange={setCategory} disabled={busy}>
              <SelectTrigger id="feedback-category"><SelectValue /></SelectTrigger>
              <SelectContent portalled={false}>
                <SelectItem value="problem">{t("使用问题")}</SelectItem>
                <SelectItem value="suggestion">{t("功能建议")}</SelectItem>
                <SelectItem value="other">{t("其他反馈")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <label className="block space-y-1.5 text-sm font-medium">{t("反馈内容")}<span className="text-foreground-muted">{t("（必填）")}</span>
            <textarea required minLength={2} maxLength={2000} rows={5} value={message}
              onChange={(event) => setMessage(event.target.value)} className={`${inputClass} resize-y`}
              placeholder={t("比如：在哪个工具遇到了什么问题，希望增加什么功能…")} />
          </label>
          <div className="-mt-2 text-right text-xs text-foreground-muted">{t(message.length)} / 2000</div>
          <label className="block space-y-1.5 text-sm font-medium">{t("邮箱")}<span className="text-foreground-muted">{t("（选填，方便回复）")}</span>
            <input type="email" autoComplete="email" maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)}
              placeholder={t("不留邮箱也可以提交")} className={inputClass} />
          </label>
          <div className="hidden" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" maxLength={200} /></label></div>
        </fieldset>
        <p className="flex items-start gap-2 text-xs leading-5 text-foreground-muted"><LockKeyhole size={15} className="mt-0.5 shrink-0" />{t("反馈仅站长可见。提交会保存留言、选填邮箱和当前页面路径，不会上传你处理的图片。使用 Cloudflare 验证以防止垃圾提交。")}</p>
        <div ref={widgetContainer} className="min-h-[65px]" />
        {verificationError && <div className="text-sm text-red-600" role="alert">{t(verificationError)}
          <button type="button" disabled={busy} className="ml-2 underline" onClick={() => { setToken(''); setVerificationError(''); setAttempt((value) => value + 1); }}>{t("重新验证")}</button>
        </div>}
        {error && <p className="text-sm text-red-600" role="alert">{t(error)}</p>}
        <button type="submit" disabled={busy || !token || message.trim().length < 2}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-medium text-primary-fg transition-opacity disabled:opacity-50">
          {busy && <LoaderCircle size={16} className="animate-spin" />}{t(busy ? '正在提交…' : '提交反馈')}
        </button>
      </form>}
    </dialog>, document.body,
  );
}
