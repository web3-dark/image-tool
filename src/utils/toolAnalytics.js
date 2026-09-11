import { classifyProcessingError, normalizeFormat, validateToolEvent } from '../config/analytics.js';

export function createToolAnalytics({ enabled, send, now = () => performance.now() }) {
  const track = (event, tool, { format = 'unknown', count = 1, durationMs = 0, error = 'none' } = {}) => {
    try {
      if (!enabled()) return;
      const payload = {
        event, tool, format: normalizeFormat(format), count,
        durationMs: Math.min(3600000, Math.max(0, Math.round(durationMs / 100) * 100)), error,
      };
      if (validateToolEvent(payload)) Promise.resolve(send(payload)).catch(() => {});
    } catch { /* Analytics is best effort and cannot interrupt local image processing. */ }
  };
  const start = (tool, format) => {
    const startedAt = now();
    let finished = false;
    track('process_started', tool, { format });
    const finish = (error, cancelled = false) => {
      if (finished) return;
      finished = true;
      track(cancelled ? 'process_cancelled' : error ? 'process_failed' : 'process_succeeded', tool, {
        format, durationMs: now() - startedAt,
        error: error ? classifyProcessingError(error) : 'none',
      });
    };
    finish.cancel = () => finish(null, true);
    return finish;
  };
  return { track, start };
}

let unavailable = false;
const analytics = createToolAnalytics({
  enabled: () => import.meta.env?.VITE_TOOL_ANALYTICS_ENABLED === 'true'
    && typeof window !== 'undefined' && window.location.hostname === 'picthin.com'
    && navigator.doNotTrack !== '1' && navigator.globalPrivacyControl !== true && !unavailable,
  send: async (payload) => {
    const response = await fetch('/api/tool-events', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), credentials: 'omit', referrerPolicy: 'no-referrer', keepalive: true,
    });
    // Missing binding or old deployment: don't repeatedly hit an unusable endpoint.
    if (!response.ok) unavailable = true;
  },
});

export const trackToolEvent = analytics.track;
export const startToolProcessing = analytics.start;
