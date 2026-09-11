import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createToolAnalytics } from '../src/utils/toolAnalytics.js';
import { onRequest } from '../functions/api/tool-events.js';
import { onRequest as middleware } from '../functions/_middleware.js';

const event = { event: 'process_succeeded', tool: '/compress-image-to-size', format: 'jpeg', count: 1, durationMs: 100, error: 'none' };
function context(payload = event, headers = {}, env) {
  const points = [];
  return { points, env: env ?? { TOOL_ANALYTICS: { writeDataPoint: (point) => points.push(point) } },
    request: new Request('https://picthin.com/api/tool-events', {
      method: 'POST', headers: { Origin: 'https://picthin.com', 'Content-Type': 'application/json', ...headers },
      body: typeof payload === 'string' ? payload : JSON.stringify(payload),
    }) };
}

test('success, failure, cancellation and batch downloads pass from client to dataset without private fields', async () => {
  const sent = [];
  let time = 0;
  const analytics = createToolAnalytics({ enabled: () => true, now: () => time, send: (payload) => sent.push(payload) });
  analytics.track('image_selected', '/', { count: 2, format: 'png', filename: 'secret.png' });
  const finish = analytics.start('/', 'png');
  time = 1234;
  finish(); finish();
  analytics.start('/', 'png')(new Error('private-file.png cannot be processed'));
  const cancelled = analytics.start('/', 'png');
  cancelled.cancel(); cancelled();
  analytics.track('download_clicked', '/', { count: 2, format: 'png' });
  assert.deepEqual(sent.map((value) => value.event), ['image_selected', 'process_started', 'process_succeeded', 'process_started', 'process_failed', 'process_started', 'process_cancelled', 'download_clicked']);
  assert.equal(sent[2].durationMs, 1200);
  assert.equal(sent[4].error, 'processing_failed');
  assert.equal(sent.at(-1).count, 2);
  for (const payload of sent) {
    const ctx = context(payload);
    assert.equal((await onRequest(ctx)).status, 204);
    assert.equal(ctx.points.length, 1);
    assert.equal(JSON.stringify(ctx.points).includes('private'), false);
    assert.equal(JSON.stringify(ctx.points).includes('secret'), false);
    assert.deepEqual(ctx.points[0].blobs, [payload.event, payload.tool, payload.format, payload.error]);
  }
});

test('disabled and failed analytics cannot break image operations', async () => {
  const disabled = createToolAnalytics({ enabled: () => false, send: () => { throw new Error('must not send'); } });
  assert.doesNotThrow(() => disabled.start('/', 'jpeg')());
  const rejected = createToolAnalytics({ enabled: () => true, send: () => Promise.reject(new Error('offline')) });
  assert.doesNotThrow(() => rejected.start('/', 'jpeg')());
  await new Promise((resolve) => setImmediate(resolve));
});

test('collector rejects untrusted, private, oversized and invalid payloads without writing', async () => {
  for (const [payload, headers, status] of [
    [event, { Origin: 'https://other.example' }, 403],
    [event, { 'Content-Type': 'text/plain' }, 415],
    [{ ...event, filename: 'secret.png' }, {}, 400],
    [{ ...event, tool: '/?email=private@example.com' }, {}, 400],
    [{ ...event, error: 'secret.png failed' }, {}, 400],
    [{ ...event, count: -1 }, {}, 400],
    [{ ...event, durationMs: 1e10 }, {}, 400],
    ['{invalid', {}, 400],
    ['x'.repeat(1025), {}, 413],
    [event, { 'Content-Length': '1025' }, 413],
    [event, { DNT: '1' }, 204],
    [event, { 'Sec-GPC': '1' }, 204],
  ]) {
    const ctx = context(payload, headers);
    assert.equal((await onRequest(ctx)).status, status);
    assert.deepEqual(ctx.points, []);
  }
  assert.equal((await onRequest(context(event, {}, {}))).status, 503);
  assert.equal((await onRequest({ request: new Request('https://picthin.com/api/tool-events'), env: {} })).status, 405);
});

test('HTML and SW revalidate; API and immutable assets retain their own caching policy', async () => {
  for (const [path, type, expected] of [['/', 'text/html', 'no-cache'], ['/compress-image-to-size', 'text/html', 'no-cache'], ['/sw.js', 'text/javascript', 'no-cache'], ['/assets/a.js', 'text/javascript', 'public, max-age=31536000, immutable'], ['/api/tool-events', 'application/json', 'no-store']]) {
    const originalCache = path.startsWith('/api/') ? 'no-store' : 'public, max-age=31536000, immutable';
    const response = await middleware({ request: new Request(`https://picthin.com${path}`), next: async () => new Response('ok', { headers: { 'Content-Type': type, 'Cache-Control': originalCache } }) });
    assert.equal(response.headers.get('Cache-Control'), expected);
    assert.equal(await response.text(), 'ok');
  }
  const redirect = await middleware({ request: new Request('https://www.picthin.com/compress-image-to-size?size=100') });
  assert.equal(redirect.status, 301);
  assert.equal(redirect.headers.get('Location'), 'https://picthin.com/compress-image-to-size?size=100');
});
