import React from 'react';
import '../styles/ImageModal.css';

/**
 * 图片放大预览模态框组件
 */
const ImageModal = ({ isOpen, imageUrl, imageTitle, onClose }) => {
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

        {/* 标题 */}
        <div className="modal-header">
          <h3 className="modal-title">{imageTitle}</h3>
        </div>

        {/* 图片容器 */}
        <div className="modal-image-container">
          <img src={imageUrl} alt={imageTitle} className="modal-image" />
        </div>

        {/* 提示文字 */}
        <div className="modal-footer">
          <p className="modal-hint">点击外部区域关闭 • 按 ESC 关闭</p>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
