import { feedbackConfigured, json } from '../../server/feedback.js';

export function onRequest({ request, env }) {
  if (request.method !== 'GET') return json({ error: '不支持此请求。' }, 405, { Allow: 'GET' });
  if (!feedbackConfigured(env, request)) return json({ enabled: false }, 503);
  return json({ enabled: true, siteKey: env.TURNSTILE_SITE_KEY });
}
