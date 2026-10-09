import { useI18n } from '../i18n/useI18n.js';
import React, { useEffect } from 'react';

/**
 * 隐私政策模态框
 */
const PrivacyPolicy = ({ isOpen, onClose }) => {
  const { t } = useI18n();
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
        className="relative bg-surface rounded-t-2xl sm:rounded-xl w-full sm:max-w-lg max-h-[85vh] flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h2 className="text-lg font-semibold text-foreground">{t("隐私政策")}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-foreground-muted hover:text-foreground hover:bg-surface-muted transition-colors"
            aria-label={t("关闭")}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* 正文 */}
        <div className="flex-1 overflow-y-auto px-6 py-5 text-sm text-foreground space-y-4 leading-relaxed">
          <p className="text-foreground-muted text-xs">{t("最后更新：2026 年 10 月")}</p>

          <section>
            <h3 className="font-semibold mb-1">{t("本地处理承诺")}</h3>
            <p className="text-foreground-muted">{t("本工具的所有图片处理均在您的设备本地完成，使用浏览器内置的 Canvas API 和 Web Worker 技术。")}<strong className="text-foreground">{t("您上传的图片不会被发送到任何服务器")}</strong>{t("，也不会被存储、分析或以任何方式传输给第三方。")}</p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">{t("我们不收集的信息")}</h3>
            <ul className="text-foreground-muted space-y-1 list-disc list-inside">
              <li>{t("您的图片内容")}</li>
              <li>{t("图片文件名或元数据")}</li>
              <li>{t("处理结果或压缩后的文件")}</li>
              <li>{t("图片处理过程中不要求提供个人身份信息")}</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-1">{t("可能收集的匿名数据")}</h3>
            <p className="text-foreground-muted">{t("站点启用 Cloudflare Web Analytics 时，仅统计页面访问量、浏览器类型和页面性能等聚合信息，用于了解哪些工具有帮助和改善访问体验。 启用工具使用统计时，还会记录工具类型、选择图片数量、处理成功或失败、取消处理、下载点击、处理耗时及固定错误类别，存储在 Cloudflare Analytics Engine 中。 不记录图片内容、文件名、图片元数据、原始错误信息或用户标识；工具使用统计遵循浏览器的 DNT 和 GPC 隐私偏好。")}</p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">{t("主动提交的意见反馈")}</h3>
            <p className="text-foreground-muted">{t("仅在您主动提交反馈时，我们会将反馈类型、留言、选填邮箱、当前页面路径和提交时间保存在 Cloudflare D1 中，仅供站长查看和处理。 邮箱用于联系您了解或回复问题，您也可以不填写。反馈不包含正在处理的图片、图片文件名、页面查询参数或浏览记录。 留言会保留供问题跟进，您可通过反馈入口提出删除请求；站长可以删除留言及邮箱。 为防止垃圾提交，反馈表单使用 Cloudflare Turnstile 验证；接口会用短期轮换的加密摘要限制提交频率，不在留言库中保存原始 IP。 过期限频记录会在后续通过验证的提交中清理。")}</p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">{t("Cookie 与本地存储")}</h3>
            <p className="text-foreground-muted">{t("本工具不使用 Cookie 追踪您的行为。浏览器可能在 Service Worker 缓存中存储应用资源，以支持离线使用，这些数据不包含任何个人信息。")} {t("手动选择的界面语言会保存在当前浏览器的本地存储中，供下次访问使用；不会发送到服务器。")}</p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">{t("第三方服务")}</h3>
            <p className="text-foreground-muted">{t("本工具不集成第三方广告或社交媒体追踪。启用访问统计时会加载 Cloudflare Web Analytics；打开反馈表单时会加载 Cloudflare Turnstile，反馈内容由 Cloudflare 托管。 图片处理相关代码和依赖仍在您的设备本地运行。")}</p>
          </section>

          <section>
            <h3 className="font-semibold mb-1">{t("联系我们")}</h3>
            <p className="text-foreground-muted">{t("如有隐私相关问题，欢迎通过页面底部的联系方式与我们联系。")}</p>
          </section>
        </div>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t border-border flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-primary text-primary-fg rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
          >{t("我已了解")}</button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
