/**
 * 图片处理工具类 - 处理压缩和格式转换
 */
import imageCompression from 'browser-image-compression';

/**
 * 获取图片信息
 * @param {File} file - 图片文件
 * @returns {Promise<Object>} - 包含宽度、高度、大小等信息
 */
export const getImageInfo = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.width,
          height: img.height,
          size: file.size,
          type: file.type,
          name: file.name,
        });
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * 将文件转为Data URL
 * @param {File} file - 图片文件
 * @returns {Promise<string>} - Data URL
 */
export const fileToDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};


/**
 * 压缩图片
 * @param {File} file - 原始图片文件
 * @param {number} quality - 质量 (0.1-1.0)
 * @param {string} format - 目标格式 (jpeg, png, webp, avif, gif)
 * @returns {Promise<Blob>} - 压缩后的Blob对象
 */
// 快速转换为指定格式的 Blob
const canvasToBlob = (file, fmt) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      canvas.getContext('2d').drawImage(img, 0, 0);
      canvas.toBlob(
        (blob) => { URL.revokeObjectURL(url); blob ? resolve(blob) : reject(new Error('转换失败')); },
        `image/${fmt}`
      );
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('图片加载失败')); };
    img.src = url;
  });


export const compressImage = async (file, quality = 0.8, format = 'jpeg', onProgress = null) => {
  try {
    const fmt = format === 'jpg' ? 'jpeg' : format;
    if (fmt === 'gif') {
      return await canvasToBlob(file, fmt);
    }
    if (fmt === 'png') {
      return await compressPng(file, quality, onProgress);
    }
    // JPEG / WebP / AVIF：支持有损压缩，quality 直接控制画质
    const options = {
      maxSizeMB: (file.size / (1024 * 1024)) * quality,
      maxWidthOrHeight: 4096,
      initialQuality: quality,
      useWebWorker: true,
      fileType: `image/${fmt}`,
      alwaysKeepResolution: true,
      onProgress: onProgress ? (p) => onProgress(p) : undefined,
    };
    return await imageCompression(file, options);
  } catch (error) {
    console.error('图片压缩失败:', error);
    throw error;
  }
};

/**
 * PNG 专用压缩
 * PNG 是无损格式，压缩只能通过缩小尺寸实现。
 * quality 0.8 → 目标文件体积为原始的 80%（通过缩小尺寸达成）
 * quality 1.0 → 保持原始尺寸，仅做 Canvas 重绘（利用浏览器内置压缩）
 * @param {File} file - PNG 或任意图片文件
 * @param {number} quality - 0.1~1.0，控制目标体积比例
 * @returns {Promise<Blob>}
 */
export const compressPng = async (file, quality = 0.8, onProgress = null) => {
  const img = new Image();
  const url = URL.createObjectURL(file);
  await new Promise((resolve, reject) => {
    img.onload = resolve;
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('图片加载失败')); };
    img.src = url;
  });
  URL.revokeObjectURL(url);

  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  // quality >= 1：不做量化，仅 Canvas 重绘（利用浏览器 PNG 编码器优化）
  if (quality >= 1) {
    return new Promise((resolve, reject) =>
      canvas.toBlob((b) => b ? resolve(b) : reject(new Error('PNG转换失败')), 'image/png')
    );
  }

  // 颜色量化：减少颜色数量 → PNG deflate 压缩率大幅提升（原理同 TinyPNG）
  // quality 0.8 → ~200 色，quality 0.5 → 128 色，quality 0.1 → 4 色
  const colors = Math.max(4, Math.min(256, Math.round(quality * 256)));

  // 用缩略图构建调色板样本（200×200 已足够采集颜色分布）
  const SAMPLE_MAX = 200;
  const scale = Math.min(1, SAMPLE_MAX / Math.max(canvas.width, canvas.height));
  const sampleW = Math.max(1, Math.round(canvas.width * scale));
  const sampleH = Math.max(1, Math.round(canvas.height * scale));
  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = sampleW;
  sampleCanvas.height = sampleH;
  sampleCanvas.getContext('2d').drawImage(img, 0, 0, sampleW, sampleH);
  const sampleImageData = sampleCanvas.getContext('2d').getImageData(0, 0, sampleW, sampleH);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Worker 直接返回 indexed PNG 字节（1字节/像素），比 canvas.toBlob 的 32-bit RGBA 小 4x
  const pngBytes = await new Promise((resolve, reject) => {
    const worker = new Worker(new URL('./pngQuantWorker.js', import.meta.url), { type: 'module' });

    // 超时保护：超大图片或浏览器资源不足时防止永久卡死
    const timeoutId = setTimeout(() => {
      worker.terminate();
      reject(new Error('PNG 压缩超时，请尝试降低质量或使用更小的图片'));
    }, 90000); // 90 秒

    worker.onmessage = ({ data }) => {
      if (data.type === 'progress') {
        onProgress?.(data.value);
        return;
      }
      clearTimeout(timeoutId);
      worker.terminate();
      data.ok ? resolve(data.result) : reject(new Error(data.error));
    };
    worker.onerror = (e) => { clearTimeout(timeoutId); worker.terminate(); reject(new Error(e.message)); };
    const imageBytes = imageData.data.buffer.slice(0);
    const sampleBytes = sampleImageData.data.buffer.slice(0);
    worker.postMessage(
      { imageBytes, sampleBytes, width: canvas.width, height: canvas.height, sampleW, sampleH, colors },
      [imageBytes, sampleBytes]
    );
  });

  return new Blob([pngBytes], { type: 'image/png' });
};

/**
 * 转换图片格式
 * @param {File} file - 原始图片文件
 * @param {string} targetFormat - 目标格式
 * @param {number} quality - 质量 (0.1-1.0)
 * @returns {Promise<Blob>} - 转换后的Blob对象
 */
export const convertImageFormat = async (file, targetFormat = 'jpeg', quality = 0.8) => {
  return compressImage(file, quality, targetFormat);
};

/**
 * 检查浏览器是否支持某种格式
 * @param {string} format - 格式名称 (webp, avif等)
 * @returns {Promise<boolean>} - 是否支持
 */
export const checkFormatSupport = async (format) => {
  if (format === 'jpeg' || format === 'png' || format === 'gif') {
    return true; // 这些格式普遍支持
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  try {
    const dataURL = canvas.toDataURL(`image/${format}`);
    return dataURL.includes(format);
  } catch {
    return false;
  }
};

/**
 * 获取支持的格式列表
 * @returns {Promise<Array>} - 支持的格式列表
 */
export const getSupportedFormats = async () => {
  const formats = [
    { name: 'JPEG', value: 'jpeg', supported: true },
    { name: 'PNG', value: 'png', supported: true },
    { name: 'GIF', value: 'gif', supported: true },
    { name: 'WebP', value: 'webp', supported: await checkFormatSupport('webp') },
    { name: 'AVIF', value: 'avif', supported: await checkFormatSupport('avif') },
  ];

  return formats;
};

/**
 * 估算压缩后的文件大小
 * @param {number} originalSize - 原始文件大小
 * @param {number} quality - 压缩质量 (0.1-1.0)
 * @param {string} format - 目标格式
 * @returns {number} - 估算的文件大小
 */
export const estimateCompressedSize = (originalSize, quality, format) => {
  // 基础压缩比例
  let compressionRatio = 0.3; // 默认压缩到30%

  // 根据格式调整压缩比
  if (format === 'webp') {
    compressionRatio = 0.25; // WebP压缩更好
  } else if (format === 'avif') {
    compressionRatio = 0.2; // AVIF压缩最好
  } else if (format === 'png') {
    compressionRatio = 0.4; // PNG压缩稍差
  }

  // 根据质量调整
  const qualityFactor = quality * 0.7 + 0.3; // 质量在0.3-1之间

  const estimatedSize = Math.round(originalSize * compressionRatio * qualityFactor);
  return Math.max(estimatedSize, 1000); // 最小1KB
};

/**
 * 计算文件大小节省百分比
 * @param {number} originalSize - 原始大小
 * @param {number} compressedSize - 压缩后大小
 * @returns {number} - 节省的百分比
 */
export const calculateSavingPercentage = (originalSize, compressedSize) => {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
};

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} - 格式化后的大小
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * 生成下载文件名
 * @param {string} originalName - 原始文件名
 * @param {string} format - 目标格式
 * @returns {string} - 新的文件名
 */
export const generateFileName = (originalName, format) => {
  // 去掉原始扩展名
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  // 添加新的扩展名
  const extension = format === 'jpeg' ? 'jpg' : format;
  return `${nameWithoutExt}-compressed.${extension}`;
};

/**
 * 下载Blob文件
 * @param {Blob} blob - 文件Blob对象
 * @param {string} fileName - 文件名
 */
export const downloadBlob = (blob, fileName) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * 批量处理图片
 * @param {Array<File>} files - 文件数组
 * @param {number} quality - 质量
 * @param {string} format - 格式
 * @param {Function} onProgress - 进度回调
 * @returns {Promise<Array>} - 处理结果数组
 */
export const processBatchImages = async (
  files,
  quality = 0.8,
  format = 'jpeg',
  onProgress = null
) => {
  const results = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const file = files[i];
      const compressed = await compressImage(file, quality, format);
      const info = await getImageInfo(file);

      results.push({
        originalFile: file,
        compressedBlob: compressed,
        originalSize: file.size,
        compressedSize: compressed.size,
        originalName: file.name,
        newName: generateFileName(file.name, format),
        savingPercentage: calculateSavingPercentage(file.size, compressed.size),
        info,
      });

      if (onProgress) {
        onProgress((i + 1) / files.length);
      }
    } catch (error) {
      console.error(`处理文件 ${files[i].name} 失败:`, error);
      results.push({
        error: error.message,
        originalName: files[i].name,
      });
    }
  }

  return results;
};

/**
 * 验证图片文件
 * @param {File} file - 文件
 * @param {number} maxSize - 最大文件大小(字节)
 * @returns {Object} - 验证结果
 */
export const validateImageFile = (file, maxSize = 50 * 1024 * 1024) => {
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/avif'];

  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: '不支持的图片格式',
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `文件大小超过限制 (最大 ${formatFileSize(maxSize)})`,
    };
  }

  return {
    valid: true,
  };
};
