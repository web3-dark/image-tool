import { consumeRateLimit, feedbackConfigured, isSameOrigin, json, readJson, validateFeedback, verifyTurnstile } from '../../server/feedback.js';

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return json({ error: '不支持此请求。' }, 405, { Allow: 'POST' });
  if (!isSameOrigin(request)) return json({ error: '请求来源不正确。' }, 403);
  if (!feedbackConfigured(env, request)) return json({ error: '反馈功能暂未开放，请稍后再试。' }, 503);
  try {
    const data = validateFeedback(await readJson(request));
    if (!data) return json({ error: '请检查反馈内容和邮箱格式。' }, 400);
    if (data.website) return json({ error: '提交未通过验证。' }, 403);
    if (!await verifyTurnstile(request, env, data.token)) return json({ error: '验证已失效，请重新验证后提交。' }, 403);
    // A retry uses a fresh Turnstile token but the same submission ID, so a lost
    // response cannot create another copy of a successfully stored message.
    const existing = await env.FEEDBACK_DB.prepare('SELECT id FROM feedback WHERE submission_id = ?').bind(data.submissionId).first();
    if (existing) return json({ ok: true });
    const now = Date.now();
    if (!await consumeRateLimit(request, env, now)) {
      return json({ error: '提交较频繁，请 10 分钟后再试。' }, 429, { 'Retry-After': '600' });
    }
    await env.FEEDBACK_DB.prepare(`INSERT INTO feedback
      (submission_id, category, message, email, page, created_at) VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(submission_id) DO NOTHING`).bind(data.submissionId, data.category, data.message, data.email, data.page, now).run();
    return json({ ok: true }, 201);
  } catch (error) {
    if (error instanceof Response) return error;
    // Do not log submitted text, email, IP, verification token or credentials.
    return json({ error: '暂时无法保存反馈，请稍后重试。' }, 503);
  }
}
