import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { onRequest as submit } from '../functions/api/feedback.js';
import { onRequest as admin } from '../functions/api/admin/feedback.js';
import { onRequest as config } from '../functions/api/feedback-config.js';
import { onRequest as middleware } from '../functions/_middleware.js';

// Execute the actual SQL/schema against SQLite rather than mocking query results.
function database() {
  const sqlite = new DatabaseSync(':memory:');
  sqlite.exec(readFileSync(new URL('../migrations/0001_feedback.sql', import.meta.url), 'utf8'));
  return {
    sqlite,
    prepare(sql) {
      const statement = sqlite.prepare(sql);
      let values = [];
      return {
        bind(...args) { values = args; return this; },
        async first() { return statement.get(...values) || null; },
        async all() { return { results: statement.all(...values) }; },
        async run() { return { meta: statement.run(...values) }; },
      };
    },
    async batch(statements) {
      sqlite.exec('BEGIN');
      try {
        const results = [];
        for (const statement of statements) results.push(await statement.all());
        sqlite.exec('COMMIT');
        return results;
      } catch (error) { sqlite.exec('ROLLBACK'); throw error; }
    },
  };
}

const secret = 'test-only-admin-token-at-least-32-characters';
function env(t) {
  const FEEDBACK_DB = database();
  t.after(() => FEEDBACK_DB.sqlite.close());
  return { FEEDBACK_DB, TURNSTILE_SECRET: 'test-secret', TURNSTILE_SITE_KEY: 'test-sitekey', TURNSTILE_HOSTNAMES: 'picthin.com', FEEDBACK_ADMIN_TOKEN: secret };
}

function payload(overrides = {}) {
  return { submissionId: crypto.randomUUID(), category: 'problem', message: '中文反馈 <script>alert(1)</script>', email: 'person@example.com', page: '/compress-png', token: crypto.randomUUID(), website: '', ...overrides };
}
function context(environment, data, method = 'POST', path = '/api/feedback', headers = {}) {
  return { env: environment, request: new Request(`https://picthin.com${path}`, {
    method, headers: { Origin: 'https://picthin.com', 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...headers },
    ...(data !== undefined && { body: typeof data === 'string' ? data : JSON.stringify(data) }),
  }) };
}
function verification(t, result = {}) {
  const tokens = new Set();
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    assert.equal(url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
    const token = options.body.get('response');
    const success = !tokens.has(token);
    tokens.add(token);
    return Response.json({ success, action: 'feedback', hostname: 'picthin.com', ...result });
  });
}

test('private feedback persists once, duplicate token is rejected, fresh-token retry is idempotent', async (t) => {
  verification(t);
  const environment = env(t);
  const data = payload();
  assert.equal((await submit(context(environment, data))).status, 201);
  assert.equal((await submit(context(environment, data))).status, 403);
  assert.equal((await submit(context(environment, { ...data, token: crypto.randomUUID() }))).status, 200);
  const rows = environment.FEEDBACK_DB.sqlite.prepare('SELECT * FROM feedback').all();
  assert.equal(rows.length, 1);
  assert.equal(rows[0].message, data.message);
  assert.equal(rows[0].email, data.email);
  assert.equal(rows[0].status, 'new');
  assert.equal(JSON.stringify(rows).includes('192.0.2.1'), false);
  assert.equal(JSON.stringify(rows).includes(data.token), false);
  const rate = environment.FEEDBACK_DB.sqlite.prepare('SELECT * FROM feedback_rate_limits').get();
  assert.match(rate.key, /^[a-f0-9]{64}$/);
  assert.equal(rate.count, 1);
});

test('5 per window limit is enforced in SQLite and old limiter records are cleared', async (t) => {
  verification(t);
  const environment = env(t);
  environment.FEEDBACK_DB.sqlite.prepare('INSERT INTO feedback_rate_limits VALUES (?, ?, ?)').run('expired', 5, 1);
  for (let count = 0; count < 5; count++) assert.equal((await submit(context(environment, payload()))).status, 201);
  const denied = await submit(context(environment, payload()));
  assert.equal(denied.status, 429);
  assert.equal(denied.headers.get('Retry-After'), '600');
  assert.equal(environment.FEEDBACK_DB.sqlite.prepare('SELECT count(*) AS n FROM feedback').get().n, 5);
  assert.equal(environment.FEEDBACK_DB.sqlite.prepare('SELECT count(*) AS n FROM feedback_rate_limits').get().n, 1);
  assert.equal((await submit(context(environment, payload(), 'POST', '/api/feedback', { 'CF-Connecting-IP': '192.0.2.2' }))).status, 201);
});

test('invalid, cross-origin, oversized and honeypot requests never reach verification or database', async (t) => {
  t.mock.method(globalThis, 'fetch', () => { throw new Error('must not verify invalid input'); });
  const environment = env(t);
  for (const [data, headers, status] of [
    [payload(), { Origin: 'https://evil.example' }, 403],
    [payload(), { 'Content-Type': 'text/plain' }, 415],
    [payload({ message: ' ' }), {}, 400],
    [payload({ message: 'x'.repeat(2001) }), {}, 400],
    [payload({ category: 'unknown' }), {}, 400],
    [payload({ email: 'bad@example' }), {}, 400],
    [payload({ page: '/?email=private@example.com' }), {}, 400],
    [payload({ token: '' }), {}, 400],
    [payload({ token: 'x'.repeat(2049) }), {}, 400],
    [payload({ website: 'spam' }), {}, 403],
    [payload({ image: 'data:image/png;base64,secret' }), {}, 400],
    ['null', {}, 400], ['{broken', {}, 400], ['x'.repeat(16385), {}, 413],
    [payload(), { 'Content-Length': '17000' }, 413],
  ]) assert.equal((await submit(context(environment, data, 'POST', '/api/feedback', headers))).status, status);
  assert.equal((await submit(context(environment, undefined, 'GET'))).status, 405);
  assert.equal((await submit(context({}, payload()))).status, 503);
  assert.equal(environment.FEEDBACK_DB.sqlite.prepare('SELECT count(*) AS n FROM feedback').get().n, 0);
});

test('verification fails closed on false success, wrong action, wrong hostname and outage', async (t) => {
  const environment = env(t);
  for (const result of [{ success: false }, { success: 'true' }, { action: 'signup' }, { hostname: 'localhost' }]) {
    verification(t, result);
    assert.equal((await submit(context(environment, payload()))).status, 403);
    t.mock.restoreAll();
  }
  t.mock.method(globalThis, 'fetch', async () => { throw new TypeError('offline'); });
  assert.equal((await submit(context(environment, payload()))).status, 403);
  assert.equal(environment.FEEDBACK_DB.sqlite.prepare('SELECT count(*) AS n FROM feedback').get().n, 0);
});

test('admin API rejects missing/wrong secrets and missing configuration before exposing any data', async (t) => {
  const environment = env(t);
  for (const token of ['', 'short', `${secret.slice(0, -1)}x`]) {
    const response = await admin(context(environment, undefined, 'GET', '/api/admin/feedback', { Authorization: `Bearer ${token}` }));
    assert.equal(response.status, 401);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.equal((await response.text()).includes('items'), false);
  }
  assert.equal((await admin(context({}, undefined, 'GET', '/api/admin/feedback', { Authorization: `Bearer ${secret}` }))).status, 401);
});

test('authenticated management paginates, updates status, filters and deletes without cross-origin writes', async (t) => {
  const environment = env(t);
  const sql = environment.FEEDBACK_DB.sqlite.prepare('INSERT INTO feedback (submission_id,category,message,email,page,created_at) VALUES (?,?,?,?,?,?)');
  for (let index = 0; index < 32; index++) sql.run(crypto.randomUUID(), 'suggestion', `反馈 ${index}`, '', '/', Date.now());
  const call = (data, method = 'GET', query = '', headers = {}) => admin(context(environment, data, method, `/api/admin/feedback${query}`, { Authorization: `Bearer ${secret}`, ...headers }));
  const first = await (await call()).json();
  assert.equal(first.items.length, 30);
  assert.equal(first.nextCursor, 3);
  const second = await (await call(undefined, 'GET', '?before=3')).json();
  assert.equal(second.items.length, 2);
  assert.equal(second.nextCursor, null);
  assert.equal((await call({ id: 32, status: 'done' }, 'PATCH', '', { Origin: 'https://evil.example' })).status, 403);
  assert.equal((await call({ id: 32, status: 'done' }, 'PATCH')).status, 200);
  assert.equal((await (await call(undefined, 'GET', '?status=done')).json()).items.length, 1);
  assert.equal((await call(undefined, 'GET', '?before=1%20OR%201=1')).status, 400);
  assert.equal((await call({ id: 32 }, 'DELETE')).status, 200);
  assert.equal((await call({ id: 32 }, 'DELETE')).status, 404);
  assert.equal((await (await call(undefined, 'GET', '?status=done')).json()).items.length, 0);
});

test('public config contains only the public site key and admin HTML cannot be cached or indexed', async (t) => {
  const environment = env(t);
  const response = config(context(environment, undefined, 'GET', '/api/feedback-config'));
  assert.deepEqual(await response.json(), { enabled: true, siteKey: 'test-sitekey' });
  assert.equal(config(context({}, undefined, 'GET', '/api/feedback-config')).status, 503);
  assert.equal(config(context({ ...environment, TURNSTILE_HOSTNAMES: 'localhost' }, undefined, 'GET', '/api/feedback-config')).status, 503);
  const page = await middleware({ request: new Request('https://picthin.com/admin/feedback'), next: async () => new Response('shell', { headers: { 'Content-Type': 'text/html' } }) });
  assert.equal(page.headers.get('Cache-Control'), 'no-store');
  assert.equal(page.headers.get('X-Robots-Tag'), 'noindex, nofollow');
});
