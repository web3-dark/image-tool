import React, { useEffect } from 'react';
import '../styles/ImageModal.css';

/**
 * 图片放大预览模态框组件
 * ESC 键关闭、打开时锁定 body 滚动；调用方不需要重复绑定。
 */
const ImageModal = ({ isOpen, imageUrl, imageTitle, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose?.(); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) {
    return null;
  }

  return (
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* 关闭按钮 */}
        <button className="modal-close-button" onClick={onClose} title="关闭">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        {/* 图片：按自身像素尺寸渲染 */}
        <img src={imageUrl} alt={imageTitle} className="modal-image" />
      </div>
    </div>
  );
};

export default ImageModal;
