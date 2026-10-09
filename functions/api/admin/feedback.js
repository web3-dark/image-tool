import { authenticated, isSameOrigin, json, readJson } from '../../../server/feedback.js';

export async function onRequest({ request, env }) {
  if (!['GET', 'PATCH', 'DELETE'].includes(request.method)) return json({ error: '不支持此请求。' }, 405, { Allow: 'GET, PATCH, DELETE' });
  if (!await authenticated(request, env)) return json({ error: '管理密钥不正确或尚未配置。' }, 401);
  if (!env.FEEDBACK_DB) return json({ error: '反馈数据库尚未配置。' }, 503);
  if (request.method !== 'GET' && !isSameOrigin(request)) return json({ error: '请求来源不正确。' }, 403);
  try {
    if (request.method === 'GET') {
      const search = new URL(request.url).searchParams;
      const status = search.get('status') || 'all';
      const before = search.get('before') || String(Number.MAX_SAFE_INTEGER);
      if (!['all', 'new', 'done'].includes(status) || !/^[1-9]\d{0,15}$/.test(before) || !Number.isSafeInteger(Number(before))) {
        return json({ error: '筛选条件不正确。' }, 400);
      }
      const result = await env.FEEDBACK_DB.prepare(`SELECT id, category, message, email, page, status, created_at
        FROM feedback WHERE id < ? AND (? = 'all' OR status = ?) ORDER BY id DESC LIMIT 31`)
        .bind(Number(before), status, status).all();
      const items = result.results.slice(0, 30);
      return json({ items, nextCursor: result.results.length > 30 ? items.at(-1).id : null });
    }
    const data = await readJson(request, 512);
    if (!Number.isSafeInteger(data.id) || data.id < 1) return json({ error: '反馈编号不正确。' }, 400);
    let result;
    if (request.method === 'PATCH') {
      if (!['new', 'done'].includes(data.status)) return json({ error: '处理状态不正确。' }, 400);
      result = await env.FEEDBACK_DB.prepare('UPDATE feedback SET status = ? WHERE id = ?').bind(data.status, data.id).run();
    } else {
      result = await env.FEEDBACK_DB.prepare('DELETE FROM feedback WHERE id = ?').bind(data.id).run();
    }
    return result.meta.changes ? json({ ok: true }) : json({ error: '这条反馈已不存在。' }, 404);
  } catch (error) {
    if (error instanceof Response) return error;
    return json({ error: '暂时无法读取或更新反馈，请稍后再试。' }, 503);
  }
}
