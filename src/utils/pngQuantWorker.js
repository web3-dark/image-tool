import { buildPalette, applyPalette, utils as iqUtils } from 'image-q';

// ─── CRC32 ──────────────────────────────────────────────────────────────────
const CRC_TABLE = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
  CRC_TABLE[i] = c;
}
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

// ─── PNG chunk ───────────────────────────────────────────────────────────────
function pngChunk(type, data) {
  const out = new Uint8Array(12 + data.length);
  const dv = new DataView(out.buffer);
  dv.setUint32(0, data.length);
  for (let i = 0; i < 4; i++) out[4 + i] = type.charCodeAt(i);
  out.set(data, 8);
  dv.setUint32(8 + data.length, crc32(out.subarray(4, 8 + data.length)));
  return out;
}

// ─── Zlib-deflate（CompressionStream 输出 RFC 1950，PNG IDAT 所需格式）──────
async function zlibDeflate(data) {
  if (typeof CompressionStream !== 'undefined') {
    // 现代浏览器：Chrome 80+ / Firefox 113+ / Safari 16.4+ / iOS 16.4+
    const cs = new CompressionStream('deflate');
    const w = cs.writable.getWriter();
    w.write(data);
    w.close();
    const parts = [];
    const r = cs.readable.getReader();
    for (;;) {
      const { done, value } = await r.read();
      if (done) break;
      parts.push(value);
    }
    const total = parts.reduce((s, p) => s + p.length, 0);
    const out = new Uint8Array(total);
    let off = 0;
    for (const p of parts) { out.set(p, off); off += p.length; }
    return out;
  }
  // 降级：iOS < 16.4 / 旧版 Firefox 等不支持 CompressionStream 的环境
  // DEFLATE stored blocks（无压缩，但 PNG 文件合法可用）
  return zlibStored(data);
}

// Adler-32 校验（zlib 尾部格式）
function adler32(data) {
  let s1 = 1, s2 = 0;
  for (let i = 0; i < data.length; i++) {
    s1 = (s1 + data[i]) % 65521;
    s2 = (s2 + s1) % 65521;
  }
  return (s2 << 16) | s1;
}

// zlib stored（RFC 1950 header + DEFLATE stored blocks RFC 1951 + Adler-32）
// CMF=0x78 FLG=0x01 → (0x78*256+0x01) % 31 === 0 ✓
function zlibStored(data) {
  const BLOCK = 65535;
  const numBlocks = Math.max(1, Math.ceil(data.length / BLOCK));
  const out = new Uint8Array(2 + numBlocks * 5 + data.length + 4);
  out[0] = 0x78; out[1] = 0x01;
  let pos = 2;
  for (let i = 0; i < numBlocks; i++) {
    const start = i * BLOCK;
    const chunk = data.subarray(start, start + BLOCK);
    const len = chunk.length;
    out[pos++] = i === numBlocks - 1 ? 0x01 : 0x00;
    out[pos++] = len & 0xFF; out[pos++] = (len >> 8) & 0xFF;
    out[pos++] = (~len) & 0xFF; out[pos++] = ((~len) >> 8) & 0xFF;
    out.set(chunk, pos); pos += len;
  }
  const chk = adler32(data);
  out[pos++] = (chk >>> 24) & 0xFF; out[pos++] = (chk >>> 16) & 0xFF;
  out[pos++] = (chk >>> 8) & 0xFF;  out[pos++] = chk & 0xFF;
  return out;
}

// ─── 量化 RGBA → indexed PNG ─────────────────────────────────────────────────
// canvas.toBlob 只能输出 32-bit RGBA (4 字节/像素)
// indexed PNG 只需 1 字节/像素（palette 索引）→ deflate 压缩率提升 4x
async function encodeIndexedPNG(rgba, width, height) {
  // 建立 palette 和 pixel-index 数组
  const colorMap = new Map(); // rgba32 key → palette index
  const pal = [];             // { r, g, b, a }
  const indices = new Uint8Array(width * height);

  for (let i = 0; i < width * height; i++) {
    const r = rgba[i * 4], g = rgba[i * 4 + 1], b = rgba[i * 4 + 2], a = rgba[i * 4 + 3];
    const key = ((r << 24) | (g << 16) | (b << 8) | a) >>> 0;
    let idx = colorMap.get(key);
    if (idx === undefined) { idx = pal.length; colorMap.set(key, idx); pal.push({ r, g, b, a }); }
    indices[i] = idx;
  }

  // IHDR: 8-bit indexed color (colorType=3)
  const ihdr = new Uint8Array(13);
  const ihdrDv = new DataView(ihdr.buffer);
  ihdrDv.setUint32(0, width);
  ihdrDv.setUint32(4, height);
  ihdr[8] = 8; ihdr[9] = 3; // bitDepth=8, colorType=3

  // PLTE: RGB 调色板条目
  const plte = new Uint8Array(pal.length * 3);
  for (let i = 0; i < pal.length; i++) {
    plte[i * 3] = pal[i].r; plte[i * 3 + 1] = pal[i].g; plte[i * 3 + 2] = pal[i].b;
  }

  // tRNS: 透明通道（仅当有半透明颜色时写入）
  const needAlpha = pal.some(p => p.a < 255);
  const trns = needAlpha ? new Uint8Array(pal.map(p => p.a)) : null;

  // IDAT: 每行前加 filter-byte=0，再 zlib 压缩
  const raw = new Uint8Array(height * (1 + width));
  for (let y = 0; y < height; y++) {
    raw[y * (1 + width)] = 0;
    raw.set(indices.subarray(y * width, (y + 1) * width), y * (1 + width) + 1);
  }
  const idat = await zlibDeflate(raw);

  // 拼接完整 PNG
  const SIG = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const chunks = [
    pngChunk('IHDR', ihdr),
    pngChunk('PLTE', plte),
    ...(trns ? [pngChunk('tRNS', trns)] : []),
    pngChunk('IDAT', idat),
    pngChunk('IEND', new Uint8Array(0)),
  ];
  const total = SIG.length + chunks.reduce((s, c) => s + c.length, 0);
  const png = new Uint8Array(total);
  let off = 0;
  png.set(SIG, off); off += SIG.length;
  for (const c of chunks) { png.set(c, off); off += c.length; }
  return png;
}

// ─── Worker 入口 ─────────────────────────────────────────────────────────────
self.onmessage = async ({ data }) => {
  const { imageBytes, sampleBytes, width, height, sampleW, sampleH, colors } = data;
  try {
    const sampleImageData = new ImageData(new Uint8ClampedArray(sampleBytes), sampleW, sampleH);
    const sampleContainer = iqUtils.PointContainer.fromImageData(sampleImageData);

    const palette = await buildPalette([sampleContainer], {
      colorDistanceFormula: 'euclidean-bt709',
      paletteQuantization: 'wuquant',
      colors,
      onProgress: (p) => self.postMessage({ type: 'progress', value: Math.round(p * 0.15) }),
    });

    const fullImageData = new ImageData(new Uint8ClampedArray(imageBytes), width, height);
    const container = iqUtils.PointContainer.fromImageData(fullImageData);
    const quantized = await applyPalette(container, palette, {
      colorDistanceFormula: 'pngquant',
      imageQuantization: 'floyd-steinberg',
      onProgress: (p) => self.postMessage({ type: 'progress', value: 15 + Math.round(p * 0.7) }),
    });

    self.postMessage({ type: 'progress', value: 85 });
    const pngBytes = await encodeIndexedPNG(quantized.toUint8Array(), width, height);
    self.postMessage({ type: 'progress', value: 95 });

    self.postMessage({ type: 'done', ok: true, result: pngBytes }, [pngBytes.buffer]);
  } catch (err) {
    self.postMessage({ type: 'done', ok: false, error: err.message });
  }
};
