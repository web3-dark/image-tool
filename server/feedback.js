const encoder = new TextEncoder();

export function json(data, status = 200, extraHeaders = {}) {
  return Response.json(data, { status, headers: {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Robots-Tag': 'noindex, nofollow',
    ...extraHeaders,
  } });
}

export function isSameOrigin(request) {
  return request.headers.get('Origin') === new URL(request.url).origin;
}

export function feedbackConfigured(env, request) {
  const hostname = new URL(request.url).hostname;
  const hostnames = (env.TURNSTILE_HOSTNAMES || '').split(',').map((value) => value.trim()).filter(Boolean);
  return Boolean(env.FEEDBACK_DB && env.TURNSTILE_SECRET && env.TURNSTILE_SITE_KEY && hostnames.includes(hostname));
}

export async function readJson(request, maxBytes = 16384) {
  if (request.headers.get('Content-Type')?.split(';')[0].trim() !== 'application/json') {
    throw json({ error: '请使用 JSON 提交。' }, 415);
  }
  if (Number(request.headers.get('Content-Length')) > maxBytes) {
    throw json({ error: '提交内容过长。' }, 413);
  }
  if (!request.body) throw json({ error: '提交内容为空。' }, 400);
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > maxBytes) {
        await reader.cancel();
        throw json({ error: '提交内容过长。' }, 413);
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const data = JSON.parse(new TextDecoder().decode(bytes));
    if (!data || Array.isArray(data) || typeof data !== 'object') throw new SyntaxError();
    return data;
  } catch (error) {
    if (error instanceof Response) throw error;
    throw json({ error: '提交内容格式不正确。' }, 400);
  } finally {
    reader.releaseLock();
  }
}

export function validateFeedback(data) {
  const allowed = new Set(['submissionId', 'category', 'message', 'email', 'page', 'token', 'website']);
  if (Object.keys(data).some((key) => !allowed.has(key))) return null;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.submissionId)) return null;
  if (!['problem', 'suggestion', 'other'].includes(data.category)) return null;
  if (typeof data.message !== 'string' || data.message.trim().length < 2 || data.message.length > 2000) return null;
  if (typeof data.email !== 'string' || data.email.length > 254) return null;
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return null;
  // Store only a pathname: no query parameters, fragments, file names or image data.
  if (typeof data.page !== 'string' || !/^\/[a-zA-Z0-9/_-]*$/.test(data.page) || data.page.length > 200) return null;
  if (typeof data.token !== 'string' || !data.token || data.token.length > 2048) return null;
  if (typeof data.website !== 'string' || data.website.length > 200) return null;
  return { ...data, message: data.message.trim() };
}

export async function hmac(secret, value) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', key, encoder.encode(value));
}

export async function authenticated(request, env) {
  const expected = env.FEEDBACK_ADMIN_TOKEN;
  const supplied = request.headers.get('Authorization')?.match(/^Bearer ([\x21-\x7e]{32,256})$/)?.[1];
  if (typeof expected !== 'string' || expected.length < 32 || expected.length > 256 || !supplied) return false;
  // Web Crypto verifies the MAC in native code, avoiding early-exit string comparison.
  const message = encoder.encode('picthin-feedback-admin');
  const signature = await hmac(expected, 'picthin-feedback-admin');
  const key = await crypto.subtle.importKey('raw', encoder.encode(supplied), { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']);
  return crypto.subtle.verify('HMAC', key, signature, message);
}

export async function verifyTurnstile(request, env, token) {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return false;
    const result = await response.json();
    return result.success === true && result.action === 'feedback'
      && result.hostname === new URL(request.url).hostname;
  } catch {
    return false;
  }
}

export async function consumeRateLimit(request, env, now) {
  const ip = request.headers.get('CF-Connecting-IP');
  // This header is provided by Cloudflare, never take an arbitrary forwarded IP.
  if (!ip) throw json({ error: '暂时无法提交，请稍后再试。' }, 503);
  const window = Math.floor(now / 600000);
  const signature = await hmac(env.TURNSTILE_SECRET, `${window}:${ip}`);
  const key = Array.from(new Uint8Array(signature), (byte) => byte.toString(16).padStart(2, '0')).join('');
  const results = await env.FEEDBACK_DB.batch([
    env.FEEDBACK_DB.prepare('DELETE FROM feedback_rate_limits WHERE expires_at <= ?').bind(now),
    env.FEEDBACK_DB.prepare(`INSERT INTO feedback_rate_limits (key, count, expires_at) VALUES (?, 1, ?)
      ON CONFLICT(key) DO UPDATE SET count = count + 1 WHERE count < 5 RETURNING count`).bind(key, (window + 2) * 600000),
  ]);
  return results[1].results.length > 0;
}
