import { validateToolEvent } from '../../src/config/analytics.js';

const MAX_BODY_BYTES = 1024;
const reply = (status) => new Response(null, { status, headers: { 'Cache-Control': 'no-store' } });

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return reply(405);
  if (request.headers.get('Origin') !== new URL(request.url).origin) return reply(403);
  if (request.headers.get('DNT') === '1' || request.headers.get('Sec-GPC') === '1') return reply(204);
  if (request.headers.get('Content-Type')?.split(';')[0] !== 'application/json') return reply(415);
  if (!env.TOOL_ANALYTICS) return reply(503);
  if (Number(request.headers.get('Content-Length')) > MAX_BODY_BYTES) return reply(413);
  if (!request.body) return reply(400);

  // Enforce the limit on the stream too, including requests without Content-Length.
  const reader = request.body.getReader();
  const chunks = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        return reply(413);
      }
      chunks.push(value);
    }
    const body = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) { body.set(chunk, offset); offset += chunk.byteLength; }
    const event = JSON.parse(new TextDecoder().decode(body));
    if (!validateToolEvent(event)) return reply(400);

    // No IP, user agent, referrer, query string, image data or per-user IDs.
    env.TOOL_ANALYTICS.writeDataPoint({
      indexes: [event.tool],
      blobs: [event.event, event.tool, event.format, event.error],
      doubles: [event.count, event.durationMs],
    });
    return reply(204);
  } catch (error) {
    return reply(error instanceof SyntaxError ? 400 : 503);
  } finally {
    reader.releaseLock();
  }
}
