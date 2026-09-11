import { TARGET_SIZE_PAGE_CONFIGS } from './targetSizes.js';
import { FORMAT_TOOL_CONFIGS } from './tools.js';

const TOOLS = new Set(['/', '/compress-image-to-size', '/remove-image-metadata',
  ...TARGET_SIZE_PAGE_CONFIGS.map(({ path }) => path), ...FORMAT_TOOL_CONFIGS.map(({ path }) => path)]);
const EVENTS = new Set(['image_selected', 'process_started', 'process_succeeded', 'process_failed', 'process_cancelled', 'download_clicked']);
const FORMATS = new Set(['jpeg', 'png', 'webp', 'avif', 'gif', 'unknown']);
const ERRORS = new Set(['none', 'unsupported_format', 'decode_failed', 'encode_failed', 'target_unreachable', 'processing_failed']);
const FIELDS = new Set(['event', 'tool', 'format', 'count', 'durationMs', 'error']);

// Shared allowlist: never accept arbitrary paths, filenames, errors or identifiers.
export function validateToolEvent(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  return Object.keys(value).every((key) => FIELDS.has(key))
    && EVENTS.has(value.event) && TOOLS.has(value.tool)
    && FORMATS.has(value.format) && ERRORS.has(value.error)
    && Number.isInteger(value.count) && value.count >= 1 && value.count <= 1000
    && Number.isInteger(value.durationMs) && value.durationMs >= 0 && value.durationMs <= 3600000
    && (value.event === 'process_failed' ? value.error !== 'none' : value.error === 'none');
}

export function normalizeFormat(format) {
  return FORMATS.has(format) ? format : 'unknown';
}

export function classifyProcessingError(error) {
  // Map locally; the actual message may contain private filenames and is never sent.
  const message = typeof error?.message === 'string' ? error.message : '';
  if (/不支持|目前支持|unsupported/i.test(message)) return 'unsupported_format';
  if (/无法.*达到目标/.test(message)) return 'target_unreachable';
  if (/图片加载失败|decode/i.test(message)) return 'decode_failed';
  if (/转换失败|生成无元数据图片失败|encode/i.test(message)) return 'encode_failed';
  return 'processing_failed';
}
