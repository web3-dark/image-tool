import React, { useState, useRef } from 'react';
import { validateImageFile } from '../utils/imageProcessor';

/**
 * 图片上传组件 - 支持拖拽和点击选择
 */
const ImageUploader = ({ onImagesSelected, isMultiple = true }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  /**
   * 处理拖拽进入
   */
  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  /**
   * 处理拖拽离开
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  /**
   * 处理拖拽放下
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  /**
   * 处理文件放下
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  /**
   * 处理选择的文件
   */
  const handleFiles = (files) => {
    setError(null);

    // 过滤和验证文件
    const validFiles = [];
    const errors = [];

    files.forEach((file) => {
      const validation = validateImageFile(file);
      if (validation.valid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    if (errors.length > 0) {
      setError(errors.join('\n'));
    }

    if (validFiles.length > 0) {
      // 如果不支持多选，只取第一个文件
      const filesToProcess = isMultiple ? validFiles : [validFiles[0]];
      onImagesSelected(filesToProcess);
    }
  };

  /**
   * 处理文件输入变化
   */
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  /**
   * 点击选择文件
   */
  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-36 ${
          isDragging
            ? 'border-primary bg-primary/5'
            : 'border-border bg-muted/30 hover:border-primary hover:bg-primary/5'
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <svg className="w-10 h-10 text-muted-foreground mb-3 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          <span className="md:hidden">点击选择图片</span>
          <span className="hidden md:inline">拖拽图片到这里</span>
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          <span className="md:hidden">支持从相册或文件中选择</span>
          <span className="hidden md:inline">或点击选择文件</span>
        </p>
        <p className="text-xs text-muted-foreground">JPG、PNG、GIF、WebP、AVIF</p>

        <input
          ref={fileInputRef}
          type="file"
          multiple={isMultiple}
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />
      </div>

      {error && (
        <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm whitespace-pre-line">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
