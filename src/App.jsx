import React, { useState, useRef } from 'react';
import ImageUploader from './components/ImageUploader';
import PreviewPanel from './components/PreviewPanel';
import BatchResultsPanel from './components/BatchResultsPanel';
import BrowserCompat from './components/BrowserCompat';
import PrivacyPolicy from './components/PrivacyPolicy';
import { Logo } from './components/Logo';
import { Slider } from './components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select';
import { compressImage, downloadBlob } from './utils/imageProcessor';

/**
 * 主应用组件
 */
function App() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [results, setResults] = useState([]);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [customFileName, setCustomFileName] = useState('');
  const qualityDebounceRef = useRef(null);
  const processIdRef = useRef(0);
  // 用 ref 追踪最新值，避免 debounce 闭包捕获到旧的 state
  const formatRef = useRef('jpeg');
  const selectedFilesRef = useRef([]);

  /**
   * 批量处理图片（单张或多张）
   */
  const processAllImages = async (files, currentQuality, currentFormat) => {
    const myId = ++processIdRef.current;
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    // 初始化结果列表，保留已有的自定义文件名
    setResults(prevResults => {
      const existingNames = {};
      prevResults.forEach(r => {
        existingNames[r.originalFile.name + '_' + r.originalFile.size] = r.fileName;
      });
      return files.map(f => ({
        id: f.name + '_' + f.size,
        originalFile: f,
        compressedBlob: null,
        fileName: existingNames[f.name + '_' + f.size] || f.name.replace(/\.[^/.]+$/, ''),
        status: 'pending',
        progress: 0,
        error: null,
      }));
    });

    await Promise.all(files.map(async (file, i) => {
      if (processIdRef.current !== myId) return;

      setResults(prev => prev.map((r, idx) => idx === i ? { ...r, status: 'processing' } : r));

      try {
        const compressed = await compressImage(
          file,
          currentQuality / 100,
          currentFormat === 'jpg' ? 'jpeg' : currentFormat,
          (p) => {
            if (processIdRef.current !== myId) return;
            setResults(prev => prev.map((r, idx) => idx === i ? { ...r, progress: p } : r));
            if (files.length === 1) setProgress(p);
          }
        );

        if (processIdRef.current !== myId) return;

        setResults(prev => prev.map((r, idx) =>
          idx === i ? { ...r, compressedBlob: compressed, status: 'done', progress: 100 } : r
        ));
        if (files.length === 1) setProgress(100);
      } catch (err) {
        if (processIdRef.current !== myId) return;
        setResults(prev => prev.map((r, idx) =>
          idx === i ? { ...r, status: 'error', error: err.message } : r
        ));
        if (files.length === 1) setError('图片处理失败: ' + err.message);
      }
    }));

    if (processIdRef.current === myId) {
      setIsProcessing(false);
    }
  };

  /**
   * 处理文件选择
   */
  const handleImagesSelected = async (files) => {
    selectedFilesRef.current = files;
    setSelectedFiles(files);
    setError(null);

    // 安全取 MIME 子类型，空 type 时 fallback 到当前格式
    const detected = (files[0].type || '').split('/')[1] || '';
    const supported = ['jpeg', 'png', 'webp', 'gif', 'avif'];
    const autoFormat = supported.includes(detected) ? detected : formatRef.current;
    formatRef.current = autoFormat;
    setFormat(autoFormat);

    if (files.length === 1) {
      const nameWithoutExt = files[0].name.substring(0, files[0].name.lastIndexOf('.'));
      setCustomFileName(nameWithoutExt || files[0].name);
    }

    await processAllImages(files, quality, autoFormat);
  };

  /**
   * 处理质量变化
   */
  const handleQualityChange = (newQuality) => {
    setQuality(newQuality);
    if (selectedFilesRef.current.length > 0) {
      clearTimeout(qualityDebounceRef.current);
      // 用 ref 而非闭包，保证 debounce 触发时拿到最新的 format 和 files
      qualityDebounceRef.current = setTimeout(() => {
        processAllImages(selectedFilesRef.current, newQuality, formatRef.current);
      }, 300);
    }
  };

  /**
   * 处理格式变化
   */
  const handleFormatChange = async (newFormat) => {
    formatRef.current = newFormat;
    setFormat(newFormat);
    if (selectedFilesRef.current.length > 0) {
      await processAllImages(selectedFilesRef.current, quality, newFormat);
    }
  };

  /**
   * 处理下载
   */
  const handleDownload = (blob, fileName) => {
    downloadBlob(blob, fileName);
  };

  /**
   * 批量下载全部
   */
  const handleDownloadAll = () => {
    const ext = format === 'jpg' ? 'jpeg' : format;
    results.forEach((result, index) => {
      if (result.compressedBlob) {
        setTimeout(() => downloadBlob(result.compressedBlob, `${result.fileName}.${ext}`), index * 200);
      }
    });
  };

  /**
   * 更新单个文件名（批量模式）
   */
  const handleUpdateFileName = (id, newName) => {
    setResults(prev => prev.map(r => r.id === id ? { ...r, fileName: newName } : r));
  };

  const [privacyOpen, setPrivacyOpen] = useState(false);
  const isSingleFile = selectedFiles.length === 1;
  const singleResult = results[0];

  return (
    <div className="flex flex-col h-screen w-full bg-background overflow-hidden">
      {/* 浏览器兼容性提示 */}
      <BrowserCompat />

      {/* 页头 */}
      <header className="flex-shrink-0 border-b border-border bg-card px-4 md:px-8 py-4 md:py-5">
        <div className="flex flex-col gap-2">
          <Logo size="md" showText={true} />
          <p className="text-sm md:text-base text-muted-foreground">智能图片压缩 • 本地处理 • 隐私优先</p>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 overflow-auto w-full bg-background">
        {selectedFiles.length === 0 ? (
          // 初始界面 - 上传页面
          <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-12 px-4 md:px-8">
            {/* 上传区域 */}
            <section className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">上传图片</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="md:hidden">选择一张或多张图片，快速压缩处理</span>
                  <span className="hidden md:inline">选择或拖拽图片，支持批量处理多张</span>
                </p>
              </div>
              <ImageUploader
                onImagesSelected={handleImagesSelected}
                isMultiple={true}
              />
            </section>

            {/* 特性卡片网格 */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: '⚡', title: '快速压缩', desc: '本地秒级处理' },
                { icon: '🔒', title: '完全隐私', desc: '不上传服务器' },
                { icon: '🎨', title: '多格式支持', desc: 'JPEG、PNG、WebP 等' },
                { icon: '📦', title: '批量处理', desc: '同时压缩多张图片' },
              ].map((feature) => (
                <div key={feature.title} className="p-4 rounded-lg border border-border bg-card hover:shadow-sm transition-shadow">
                  <div className="text-3xl mb-2">{feature.icon}</div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // 处理界面 - 工具栏 + 预览
          <div className="relative flex flex-col gap-4 h-full px-6 py-4 bg-background">
            {/* 左上角关闭按钮：即使处理中也可强制取消返回 */}
            <button
              onClick={() => {
                clearTimeout(qualityDebounceRef.current);
                ++processIdRef.current; // 取消正在进行的压缩
                setIsProcessing(false);
                selectedFilesRef.current = [];
                setSelectedFiles([]);
                setResults([]);
              }}
              className="absolute top-1 left-3 w-8 h-8 flex items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:text-foreground hover:border-foreground transition-colors"
              title="更换图片"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            {/* 顶部工具栏 */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-card border border-border rounded-lg">
              {/* 文件名（仅单张时显示） */}
              {isSingleFile && (
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">文件名称</span>
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      type="text"
                      className="flex-1 px-3 py-1.5 text-sm border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                      value={customFileName}
                      onChange={(e) => setCustomFileName(e.target.value)}
                      placeholder="输入文件名"
                    />
                    <span className="text-sm text-muted-foreground">.{format === 'jpg' ? 'jpeg' : format}</span>
                  </div>
                </div>
              )}

              {/* 右侧: 质量和格式 */}
              <div className="flex gap-4 items-center flex-wrap md:flex-nowrap">
                {/* 质量滑块 */}
                {format !== 'gif' && (
                  <div className="flex items-center gap-3 min-w-fit">
                    <label className="text-sm font-medium text-foreground whitespace-nowrap">质量:</label>
                    <Slider
                      value={[quality]}
                      onValueChange={(val) => handleQualityChange(val[0])}
                      min={10}
                      max={100}
                      step={5}
                      disabled={isProcessing}
                      className="w-32"
                    />
                    <span className="text-sm text-muted-foreground min-w-[3rem]">{quality}%</span>
                  </div>
                )}

                {/* 格式选择 */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground whitespace-nowrap">格式:</label>
                    <Select value={format} onValueChange={handleFormatChange} disabled={isProcessing}>
                      <SelectTrigger className="w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="jpeg">JPEG</SelectItem>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                        <SelectItem value="avif">AVIF</SelectItem>
                        <SelectItem value="gif">GIF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {format === 'png' && (
                    <p className="text-xs text-amber-500">照片转 PNG 体积会增大，建议用 WebP</p>
                  )}
                  {format === 'gif' && (
                    <p className="text-xs text-amber-500">无损格式，照片转换后体积会大幅增加；动态 GIF 仅保留第一帧</p>
                  )}
                </div>
              </div>
            </div>

            {/* 预览/结果区域 */}
            <div className="flex-1 bg-card border border-border rounded-lg overflow-hidden flex flex-col">
              {isSingleFile ? (
                // 单张：预览面板
                <>
                  {!isProcessing && singleResult?.compressedBlob && (
                    <PreviewPanel
                      originalFile={selectedFiles[0]}
                      compressedBlob={singleResult.compressedBlob}
                      compressedFileName={`${customFileName}.${format === 'jpg' ? 'jpeg' : format}`}
                      onDownload={handleDownload}
                      isProcessing={isProcessing}
                    />
                  )}

                  {isProcessing && (
                    <div className="flex flex-col items-center justify-center h-full gap-4 px-8">
                      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm text-muted-foreground">正在处理... {progress > 0 ? `${progress}%` : ''}</p>
                      {progress > 0 && (
                        <div className="w-full max-w-xs h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-150"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
                        <circle cx="12" cy="12" r="10"></circle>
                        <path d="M12 8v4M12 16h.01"></path>
                      </svg>
                      <span className="text-sm">{error}</span>
                    </div>
                  )}
                </>
              ) : (
                // 多张：批量结果面板
                <BatchResultsPanel
                  results={results}
                  format={format}
                  onDownload={handleDownload}
                  onDownloadAll={handleDownloadAll}
                  onUpdateFileName={handleUpdateFileName}
                  isProcessing={isProcessing}
                />
              )}
            </div>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="flex-shrink-0 border-t border-border bg-card px-8 pt-4 safe-area-bottom">
        <div className="flex items-center justify-center gap-3 text-base font-medium text-foreground">
          <span>图片仅在本地处理，不上传服务器，隐私安全有保障</span>
          <span className="text-muted-foreground">|</span>
          <button
            onClick={() => setPrivacyOpen(true)}
            className="underline underline-offset-2 hover:text-primary transition-colors"
          >
            隐私政策
          </button>
        </div>
      </footer>

      {/* 隐私政策弹窗 */}
      <PrivacyPolicy isOpen={privacyOpen} onClose={() => setPrivacyOpen(false)} />
    </div>
  );
}

export default App;
