import React, { useEffect } from 'react';

/**
 * 隐私政策模态框
 */
const PrivacyPolicy = ({ isOpen, onClose }) => {
  // ESC 关闭
  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* 遮罩 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* 内容 */}
      <div
        className="relative bg-card rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[85vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-foreground">隐私政策</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="关闭"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 正文 */}
        <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-foreground space-y-4 leading-relaxed">
          <p className="text-muted-foreground text-xs">最后更新：2026 年 3 月</p>

          <section>
            <h3 className="font-semibold mb-1">本地处理承诺</h3>
            <p className="text-muted-foreground">
              本工具的所有图片处理均在您的设备本地完成，使用浏览器内置的 Canvas API 和 Web Worker 技术。
              <strong className="text-foreground">您上传的图片不会被发送到任何服务器</strong>，也不会被存储、分析或以任何方式传输给第三方。
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">我们不收集的信息</h3>
            <ul className="text-muted-foreground space-y-1 list-disc list-inside">
              <li>您的图片内容</li>
              <li>图片文件名或元数据</li>
              <li>处理结果或压缩后的文件</li>
              <li>任何个人身份信息</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-1">可能收集的匿名数据</h3>
            <p className="text-muted-foreground">
              如果您的访问产生了页面访问统计（通过匿名分析工具），我们仅收集不可识别个人身份的聚合数据，如页面访问量、使用的浏览器类型等，用于改善产品体验。
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">Cookie 与本地存储</h3>
            <p className="text-muted-foreground">
              本工具不使用 Cookie 追踪您的行为。浏览器可能在 Service Worker 缓存中存储应用资源，以支持离线使用，这些数据不包含任何个人信息。
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">第三方服务</h3>
            <p className="text-muted-foreground">
              本工具不集成任何第三方广告、社交媒体追踪或数据收集服务。所有依赖库均在本地运行。
            </p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">联系我们</h3>
            <p className="text-muted-foreground">
              如有隐私相关问题，欢迎通过页面底部的联系方式与我们联系。
            </p>
          </section>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-border flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >
            我已了解
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
