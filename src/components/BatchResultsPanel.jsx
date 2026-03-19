import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { formatFileSize, calculateSavingPercentage } from '../utils/imageProcessor';

/**
 * 批量结果行组件
 */
const ResultRow = ({ result, ext, onDownload, onUpdateFileName }) => {
  const [thumbUrl, setThumbUrl] = useState(null);
  const [downloaded, setDownloaded] = useState(false);

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

  return (
    <div className="flex items-center gap-3 px-4 py-3">
      {/* 缩略图 */}
      <div className="w-12 h-12 flex-shrink-0 bg-muted rounded overflow-hidden flex items-center justify-center">
        {result.status === 'processing' ? (
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        ) : result.status === 'error' ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5 text-destructive">
            <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" strokeWidth="2" />
          </svg>
        ) : thumbUrl ? (
          <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-4 h-4 border-2 border-muted-foreground/20 rounded-full" />
        )}
      </div>

      {/* 文件信息 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-1">
          <input
            type="text"
            value={result.fileName}
            onChange={(e) => onUpdateFileName(result.id, e.target.value)}
            className="flex-1 min-w-0 px-2 py-0.5 text-sm border border-input rounded focus:outline-none focus:ring-1 focus:ring-ring bg-background"
          />
          <span className="text-xs text-muted-foreground flex-shrink-0">.{ext}</span>
        </div>

        {result.status === 'processing' && (
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-150"
                style={{ width: `${result.progress}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground w-8 text-right">{result.progress}%</span>
          </div>
        )}

        {result.status === 'done' && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>{formatFileSize(result.originalFile.size)}</span>
            <span>→</span>
            <span>{formatFileSize(result.compressedBlob.size)}</span>
            <span className={`font-medium ${saving >= 0 ? 'text-green-600' : 'text-red-500'}`}>
              ({saving >= 0 ? '-' : '+'}{Math.abs(saving)}%)
            </span>
          </div>
        )}

        {result.status === 'pending' && (
          <p className="text-xs text-muted-foreground">等待处理...</p>
        )}

        {result.status === 'error' && (
          <p className="text-xs text-destructive truncate">{result.error}</p>
        )}
      </div>

      {/* 下载按钮 */}
      <Button
        size="sm"
        variant={downloaded ? 'default' : 'outline'}
        disabled={result.status !== 'done'}
        onClick={handleDownloadClick}
        className={`flex-shrink-0 ${downloaded ? 'bg-green-600 hover:bg-green-600' : ''}`}
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
