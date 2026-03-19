import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { fileToDataURL, formatFileSize, calculateSavingPercentage } from '../utils/imageProcessor';
import ImageModal from './ImageModal';

/**
 * 预览面板组件 - 显示原始和压缩图片的对比
 */
const PreviewPanel = ({
  originalFile,
  compressedBlob,
  compressedFileName,
  onDownload,
  isProcessing = false,
}) => {
  const [originalDataURL, setOriginalDataURL] = useState(null);
  const [compressedDataURL, setCompressedDataURL] = useState(null);
  const [comparisonMode, setComparisonMode] = useState('split'); // 'split' 或 'slider'
  const [sliderPosition, setSliderPosition] = useState(50);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [downloaded, setDownloaded] = useState(false);

  /**
   * 初始化预览图片
   */
  useEffect(() => {
    const loadImages = async () => {
      try {
        if (originalFile) {
          const originalURL = await fileToDataURL(originalFile);
          setOriginalDataURL(originalURL);
        }

        if (compressedBlob) {
          const compressedFile = new File([compressedBlob], 'compressed', {
            type: compressedBlob.type
          });
          const compressedURL = await fileToDataURL(compressedFile);
          setCompressedDataURL(compressedURL);
        }
      } catch (error) {
        console.error('加载预览图片失败:', error);
      }
    };

    loadImages();
  }, [originalFile, compressedBlob]);

  /**
   * ESC键关闭模态框
   */
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && modalOpen) {
        setModalOpen(false);
      }
    };

    if (modalOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [modalOpen]);

  /**
   * 打开图片放大预览
   */
  const openImageModal = (imageUrl, title) => {
    setModalImage(imageUrl);
    setModalTitle(title);
    setModalOpen(true);
  };

  /**
   * 关闭图片放大预览
   */
  const closeImageModal = () => {
    setModalOpen(false);
    setModalImage(null);
    setModalTitle('');
  };

  /**
   * 处理滑块移动
   */
  const handleSliderChange = (e) => {
    setSliderPosition(e.clientX);
  };

  /**
   * 获取预览面板宽度
   */
  const getSliderPercentage = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percentage = ((e.clientX - rect.left) / rect.width) * 100;
    return Math.max(0, Math.min(100, percentage));
  };

  /**
   * 计算节省百分比
   */
  const savingPercentage = calculateSavingPercentage(
    originalFile?.size || 0,
    compressedBlob?.size || 0
  );

  if (!originalDataURL) {
    return <div className="flex items-center justify-center h-full text-muted-foreground">加载中...</div>;
  }

  return (
    <div className="flex flex-col h-full gap-4 p-4">
      <h3 className="text-lg font-semibold text-foreground">预览效果</h3>

      {/* 模式切换按钮 */}
      <div className="hidden md:flex gap-2">
        <Button
          variant={comparisonMode === 'split' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setComparisonMode('split')}
          title="并排对比"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M2 12h20" />
          </svg>
          并排对比
        </Button>
        <Button
          variant={comparisonMode === 'slider' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setComparisonMode('slider')}
          title="滑块对比"
          className="hidden md:inline-flex"
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2v20M6 6h12v12H6z" />
          </svg>
          滑块对比
        </Button>
      </div>

      {/* 预览内容 */}
      {(comparisonMode === 'split' || window.innerWidth < 768) ? (
        // 并排对比模式
        <div className="flex-1 flex gap-4 overflow-auto">
          {/* 原始图片 */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <p className="text-sm font-medium text-foreground">原始图片</p>
            <div
              className="flex-1 relative bg-muted rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => openImageModal(originalDataURL, '原始图片')}
              title="点击放大查看"
            >
              <img
                src={originalDataURL}
                alt="原始图片"
                className="w-full h-full object-contain"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-2xl">🔍</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">文件大小: <span className="font-medium text-foreground">{formatFileSize(originalFile?.size || 0)}</span></p>
          </div>

          {/* 压缩后图片 */}
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <p className="text-sm font-medium text-foreground">压缩后图片</p>
            <div
              className="flex-1 relative bg-muted rounded-lg overflow-hidden cursor-pointer group"
              onClick={() => compressedDataURL && openImageModal(compressedDataURL, '压缩后图片')}
              title="点击放大查看"
            >
              {compressedDataURL && (
                <>
                  <img
                    src={compressedDataURL}
                    alt="压缩后图片"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-white text-2xl">🔍</span>
                  </div>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">文件大小: <span className="font-medium text-foreground">{formatFileSize(compressedBlob?.size || 0)}</span></p>
          </div>
        </div>
      ) : (
        // 滑块对比模式
        <div
          className="flex-1 relative bg-muted rounded-lg overflow-hidden"
          onMouseMove={(e) => {
            const percentage = getSliderPercentage(e);
            setSliderPosition(percentage);
          }}
        >
          {/* 背景图片（原始） */}
          <div className="w-full h-full">
            <img
              src={originalDataURL}
              alt="原始图片"
              className="w-full h-full object-contain"
            />
          </div>

          {/* 滑块位置的压缩图片 */}
          <div
            className="absolute top-0 left-0 h-full overflow-hidden"
            style={{ width: `${sliderPosition}%` }}
          >
            {compressedDataURL && (
              <img
                src={compressedDataURL}
                alt="压缩后图片"
                className="w-screen h-full object-contain"
              />
            )}
          </div>

          {/* 滑块手柄 */}
          <div
            className="absolute top-0 h-full w-1 bg-primary cursor-col-resize transition-none"
            style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg text-lg font-bold">
              ‹
            </div>
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg text-lg font-bold">
              ›
            </div>
          </div>

          {/* 标签 */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
            <span className="bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">原始</span>
            <span className="bg-black/50 text-white px-2 py-1 rounded text-xs font-medium">压缩</span>
          </div>
        </div>
      )}

      {/* 统计信息和下载按钮 */}
      <div className="flex flex-col md:flex-row items-center gap-4 pt-2 border-t border-border">
        {/* 统计信息 */}
        <div className="flex justify-between w-full md:flex-1 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">{savingPercentage >= 0 ? '节省空间' : '文件增大'}</span>
            <span className={`font-semibold ${savingPercentage >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              {Math.abs(savingPercentage)}%
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">原始大小</span>
            <span className="font-semibold text-foreground">{formatFileSize(originalFile?.size || 0)}</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">压缩后</span>
            <span className="font-semibold text-foreground">{formatFileSize(compressedBlob?.size || 0)}</span>
          </div>
        </div>

        {/* 下载按钮 */}
        {compressedBlob && (
          <Button
            onClick={() => {
              onDownload(compressedBlob, compressedFileName);
              setDownloaded(true);
              setTimeout(() => setDownloaded(false), 2000);
            }}
            disabled={isProcessing}
            className={`flex-shrink-0 transition-colors ${downloaded ? 'bg-green-600 hover:bg-green-600' : ''}`}
          >
            {downloaded ? (
              <>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                下载成功
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
                </svg>
                下载图片
              </>
            )}
          </Button>
        )}
      </div>

      {/* 图片放大预览模态框 */}
      <ImageModal
        isOpen={modalOpen}
        imageUrl={modalImage}
        imageTitle={modalTitle}
        onClose={closeImageModal}
      />
    </div>
  );
};

export default PreviewPanel;
