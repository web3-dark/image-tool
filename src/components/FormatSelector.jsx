import React, { useState, useEffect } from 'react';
import '../styles/FormatSelector.css';
import { getSupportedFormats } from '../utils/imageProcessor';

/**
 * 格式选择组件 - 显示支持的图片格式
 */
const FormatSelector = ({ selectedFormat = 'jpeg', onFormatChange }) => {
  const [formats, setFormats] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * 初始化支持的格式
   */
  useEffect(() => {
    const loadFormats = async () => {
      try {
        const supportedFormats = await getSupportedFormats();
        setFormats(supportedFormats);
      } catch (error) {
        console.error('加载格式列表失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFormats();
  }, []);

  /**
   * 处理格式选择
   */
  const handleFormatSelect = (format) => {
    onFormatChange(format);
  };

  /**
   * 获取格式描述
   */
  const getFormatDescription = (format) => {
    const descriptions = {
      jpeg: '适合照片，文件较小',
      png: '支持透明，无损压缩',
      gif: '支持静态和动画',
      webp: '现代格式，压缩更好',
      avif: '最新格式，极小文件'
    };
    return descriptions[format] || '';
  };

  if (loading) {
    return <div className="format-selector-container">加载格式列表中...</div>;
  }

  return (
    <div className="format-selector-container">
      <h3 className="format-title">输出格式</h3>

      <div className="format-grid">
        {formats.map((format) => (
          <button
            key={format.value}
            className={`format-button ${selectedFormat === format.value ? 'active' : ''} ${!format.supported ? 'disabled' : ''}`}
            onClick={() => format.supported && handleFormatSelect(format.value)}
            disabled={!format.supported}
            title={format.supported ? getFormatDescription(format.value) : '您的浏览器不支持此格式'}
          >
            <div className="format-name">{format.name}</div>
            <div className="format-description">
              {format.supported ? getFormatDescription(format.value) : '不支持'}
            </div>
            {selectedFormat === format.value && (
              <div className="format-checkmark">✓</div>
            )}
          </button>
        ))}
      </div>

      <div className="format-info">
        <p className="format-note">
          💡 选择的格式将用于压缩和转换图片。
        </p>
      </div>
    </div>
  );
};

export default FormatSelector;
