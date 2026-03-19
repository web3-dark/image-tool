import React, { useState, useMemo } from 'react';
import '../styles/QualityAdjustment.css';
import { estimateCompressedSize, formatFileSize } from '../utils/imageProcessor';

/**
 * 质量调整组件 - 提供滑块、输入框和预设
 */
const QualityAdjustment = ({
  quality = 80,
  onQualityChange,
  originalFileSize = 0,
  format = 'jpeg'
}) => {
  const [localQuality, setLocalQuality] = useState(quality);

  // 计算估算的压缩大小
  const estimatedSize = useMemo(() => {
    return estimateCompressedSize(originalFileSize, localQuality / 100, format);
  }, [localQuality, originalFileSize, format]);

  // 计算节省的百分比
  const savingPercentage = useMemo(() => {
    if (originalFileSize === 0) return 0;
    return Math.round(((originalFileSize - estimatedSize) / originalFileSize) * 100);
  }, [originalFileSize, estimatedSize]);

  /**
   * 处理滑块变化
   */
  const handleSliderChange = (e) => {
    const newQuality = parseInt(e.target.value);
    setLocalQuality(newQuality);
    onQualityChange(newQuality);
  };

  /**
   * 处理输入框变化
   */
  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value === '') return;

    let newQuality = parseInt(value);

    // 限制在10-100之间
    if (newQuality < 10) newQuality = 10;
    if (newQuality > 100) newQuality = 100;

    setLocalQuality(newQuality);
    onQualityChange(newQuality);
  };

  /**
   * 应用预设
   */
  const applyPreset = (presetQuality) => {
    setLocalQuality(presetQuality);
    onQualityChange(presetQuality);
  };

  /**
   * 获取质量等级标签
   */
  const getQualityLabel = () => {
    if (localQuality >= 85) return '高质量';
    if (localQuality >= 60) return '中等质量';
    return '低质量';
  };

  /**
   * 获取质量颜色
   */
  const getQualityColor = () => {
    if (localQuality >= 85) return '#10b981';
    if (localQuality >= 60) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="quality-adjustment-container">
      <div className="quality-header">
        <h3 className="quality-title">压缩质量</h3>
        <span className="quality-label" style={{ color: getQualityColor() }}>
          {getQualityLabel()}
        </span>
      </div>

      {/* 质量滑块 */}
      <div className="quality-slider-wrapper">
        <input
          type="range"
          min="10"
          max="100"
          step="5"
          value={localQuality}
          onChange={handleSliderChange}
          className="quality-slider"
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #f59e0b 50%, #10b981 100%)`
          }}
        />
      </div>

      {/* 质量值显示和输入 */}
      <div className="quality-input-wrapper">
        <label htmlFor="quality-input" className="quality-input-label">质量:</label>
        <input
          id="quality-input"
          type="number"
          min="10"
          max="100"
          value={localQuality}
          onChange={handleInputChange}
          className="quality-input-field"
        />
        <span className="quality-unit">%</span>
      </div>

      {/* 质量预设 */}
      <div className="quality-presets">
        <button
          className={`preset-button ${localQuality <= 50 ? 'active' : ''}`}
          onClick={() => applyPreset(40)}
          title="最小文件大小，但质量会降低"
        >
          <span className="preset-name">低</span>
          <span className="preset-quality">40%</span>
        </button>
        <button
          className={`preset-button ${localQuality > 50 && localQuality < 80 ? 'active' : ''}`}
          onClick={() => applyPreset(70)}
          title="平衡质量和文件大小（推荐）"
        >
          <span className="preset-name">中</span>
          <span className="preset-quality">70%</span>
        </button>
        <button
          className={`preset-button ${localQuality >= 80 ? 'active' : ''}`}
          onClick={() => applyPreset(90)}
          title="保持高质量，文件会较大"
        >
          <span className="preset-name">高</span>
          <span className="preset-quality">90%</span>
        </button>
      </div>

      {/* 估算信息 */}
      {originalFileSize > 0 && (
        <div className="quality-estimation">
          <div className="estimation-row">
            <span className="estimation-label">原始大小:</span>
            <span className="estimation-value">{formatFileSize(originalFileSize)}</span>
          </div>
          <div className="estimation-row">
            <span className="estimation-label">估算大小:</span>
            <span className="estimation-value">{formatFileSize(estimatedSize)}</span>
          </div>
          <div className="estimation-row saving">
            <span className="estimation-label">节省空间:</span>
            <span className="estimation-value saving-value">{savingPercentage}%</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QualityAdjustment;
