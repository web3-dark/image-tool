import React, { useState, useEffect } from 'react';

/**
 * 检测浏览器是否支持必要的 API
 */
function checkCompatibility() {
  const issues = [];

  if (typeof Worker === 'undefined') {
    issues.push('Web Worker（图片压缩需要）');
  }
  if (typeof FileReader === 'undefined') {
    issues.push('FileReader（文件读取需要）');
  }
  if (!HTMLCanvasElement.prototype.toBlob) {
    issues.push('Canvas toBlob（图片处理需要）');
  }
  if (typeof URL === 'undefined' || typeof URL.createObjectURL === 'undefined') {
    issues.push('URL API（文件下载需要）');
  }

  return issues;
}

/**
 * 浏览器兼容性提示横幅
 * 仅在检测到不兼容 API 时显示
 */
const BrowserCompat = () => {
  const [issues, setIssues] = useState([]);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const detected = checkCompatibility();
      setIssues(detected);
    } catch {
      // 检测本身报错，说明浏览器极旧，也提示
      setIssues(['基础 API 支持不足']);
    }
  }, []);

  if (issues.length === 0 || dismissed) return null;

  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-amber-50 border-b border-amber-200 text-amber-800">
      <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
      <div className="flex-1 text-sm">
        <span className="font-medium">浏览器兼容性提示：</span>
        您的浏览器不支持 {issues.join('、')}，建议升级到 Chrome 80+、Safari 16+ 或 Firefox 113+ 以获得最佳体验。
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 text-amber-600 hover:text-amber-800"
        aria-label="关闭提示"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

export default BrowserCompat;
