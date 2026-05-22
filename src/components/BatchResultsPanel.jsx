import React, { useState, useEffect, useRef } from 'react';
import { Pencil } from 'lucide-react';
import { Button } from './ui/button';
import { formatFileSize, calculateSavingPercentage } from '../utils/imageProcessor';
import ImageModal from './ImageModal';

/**
 * 批量结果行组件
 */
const ResultRow = ({ result, ext, onDownload, onUpdateFileName }) => {
  const [thumbUrl, setThumbUrl] = useState(null);
  const [downloaded, setDownloaded] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const inputRef = useRef(null);

  const handleEditClick = () => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    el.select();
  };

  useEffect(() => {
    if (result.compressedBlob) {
      const url = URL.createObjectURL(result.compressedBlob);
      setThumbUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [result.compressedBlob]);

  const saving = result.compressedBlob
    ? calculateSavingPercentage(result.originalFile.size, result.compressedBlob.size)
    : 0;

  const handleDownloadClick = () => {
    onDownload(result.compressedBlob, `${result.fileName}.${ext}`);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  const canPreview = result.status === 'done' && !!thumbUrl;
  const handleThumbClick = () => {
    if (canPreview) setPreviewOpen(true);
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* 缩略图（处理完成后点击放大预览） */}
      <button
        type="button"
        onClick={handleThumbClick}
        disabled={!canPreview}
        title={canPreview ? '点击查看大图' : undefined}
        className={`w-12 h-12 flex-shrink-0 bg-surface-muted rounded overflow-hidden flex items-center justify-center p-0 border-0 ${
          canPreview ? 'cursor-zoom-in hover:ring-2 hover:ring-primary transition-shadow' : 'cursor-default'
        }`}
      >
        {result.status === 'processing' ? (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : result.status === 'error' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-danger">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" strokeWidth="2" />
          </svg>
        ) : thumbUrl ? (
          <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-4 h-4 border-2 border-foreground-muted/20 rounded-full" />
        )}
      </button>

      {/* 文件信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5">
          <div className="relative w-full max-w-xs min-w-0">
            <input
              ref={inputRef}
              type="text"
              value={result.fileName}
              onChange={(e) => onUpdateFileName(result.id, e.target.value)}
              className="w-full pl-2.5 pr-8 py-1 text-base border border-border rounded focus:outline-none focus:ring-1 focus:ring-primary bg-surface"
            />
            <button
              type="button"
              onClick={handleEditClick}
              title="编辑文件名"
              tabIndex={-1}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded text-foreground-muted hover:text-primary hover:bg-primary-muted transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
          </div>
          <span className="text-sm text-foreground-muted flex-shrink-0">.{ext}</span>

          {result.status === 'done' && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-foreground-muted flex-shrink-0 whitespace-nowrap ml-auto">
              <span>{formatFileSize(result.originalFile.size)}</span>
              <span>→</span>
              <span>{formatFileSize(result.compressedBlob.size)}</span>
              <span className={`font-medium ${saving >= 0 ? 'text-success' : 'text-danger'}`}>
                ({saving >= 0 ? '-' : '+'}{Math.abs(saving)}%)
              </span>
            </div>
          )}
        </div>

        {/* 移动端窄屏：体积对比放第二行 */}
        {result.status === 'done' && (
          <div className="sm:hidden mt-1.5 flex items-center gap-1.5 text-sm text-foreground-muted whitespace-nowrap">
            <span>{formatFileSize(result.originalFile.size)}</span>
            <span>→</span>
            <span>{formatFileSize(result.compressedBlob.size)}</span>
            <span className={`font-medium ${saving >= 0 ? 'text-success' : 'text-danger'}`}>
              ({saving >= 0 ? '-' : '+'}{Math.abs(saving)}%)
            </span>
          </div>
        )}

        {result.status === 'processing' && (
          <div className="mt-1 flex items-center gap-2">
            <div className="flex-1 h-1 bg-surface-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-150"
                style={{ width: `${result.progress}%` }}
              />
            </div>
            <span className="text-xs text-foreground-muted w-8 text-right">{result.progress}%</span>
          </div>
        )}

        {result.status === 'pending' && (
          <p className="mt-1 text-xs text-foreground-muted">等待处理...</p>
        )}

        {result.status === 'error' && (
          <p className="mt-1 text-xs text-danger truncate">{result.error}</p>
        )}
      </div>

      {/* 下载按钮 */}
      <Button
        size="sm"
        variant={downloaded ? 'default' : 'outline'}
        disabled={result.status !== 'done'}
        onClick={handleDownloadClick}
        className={`flex-shrink-0 ${downloaded ? 'bg-success hover:bg-success' : ''}`}
      >
        {downloaded ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
        )}
      </Button>

      <ImageModal
        isOpen={previewOpen}
        imageUrl={thumbUrl}
        imageTitle={`${result.fileName}.${ext}`}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
};

/**
 * 批量结果面板组件
 */
const BatchResultsPanel = ({ results, format, onDownload, onDownloadAll, onUpdateFileName, isProcessing }) => {
  const ext = format === 'jpg' ? 'jpeg' : format;
  const doneCount = results.filter(r => r.status === 'done').length;
  const totalCount = results.length;

  return (
    <div className="flex flex-col h-full">
      {/* 头部：统计 + 全部下载 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
        <span className="text-sm font-medium text-foreground">
          {isProcessing
            ? `处理中... ${doneCount}/${totalCount}`
            : `${doneCount} 张处理完成，共 ${totalCount} 张`}
        </span>
        <Button
          size="sm"
          onClick={onDownloadAll}
          disabled={isProcessing || doneCount === 0}
        >
          <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
          </svg>
          全部下载
        </Button>
      </div>

      {/* 结果列表 */}
      <div className="flex-1 overflow-y-auto divide-y divide-border">
        {results.map((result, index) => (
          <ResultRow
            key={index}
            result={result}
            ext={ext}
            onDownload={onDownload}
            onUpdateFileName={onUpdateFileName}
          />
        ))}
      </div>
    </div>
  );
};

export default BatchResultsPanel;
