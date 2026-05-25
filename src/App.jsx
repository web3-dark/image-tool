import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
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
import { Zap, ShieldCheck, Palette, Layers, X, AlertCircle, Upload, Pencil } from 'lucide-react';

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
  const [isPageDragOver, setIsPageDragOver] = useState(false);
  const pageDragCounterRef = useRef(0);
  const handleImagesSelectedRef = useRef(null);
  const [error, setError] = useState(null);
  const [customFileName, setCustomFileName] = useState('');
  const qualityDebounceRef = useRef(null);
  const processIdRef = useRef(0);
  const customNameInputRef = useRef(null);
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

  // 全局拖拽：用 ref 转发到最新的 handleImagesSelected，避免每次 state 变化都重绑监听
  handleImagesSelectedRef.current = handleImagesSelected;

  useEffect(() => {
    const hasFiles = (e) => Array.from(e.dataTransfer?.types || []).includes('Files');

    const onEnter = (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      pageDragCounterRef.current += 1;
      setIsPageDragOver(true);
    };
    const onOver = (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault(); // 必须 preventDefault，否则 drop 不会触发
    };
    const onLeave = (e) => {
      if (!hasFiles(e)) return;
      pageDragCounterRef.current -= 1;
      if (pageDragCounterRef.current <= 0) {
        pageDragCounterRef.current = 0;
        setIsPageDragOver(false);
      }
    };
    const onDrop = (e) => {
      if (!hasFiles(e)) return;
      e.preventDefault();
      pageDragCounterRef.current = 0;
      setIsPageDragOver(false);
      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
      if (files.length > 0) {
        handleImagesSelectedRef.current?.(files);
      }
    };

    window.addEventListener('dragenter', onEnter);
    window.addEventListener('dragover', onOver);
    window.addEventListener('dragleave', onLeave);
    window.addEventListener('drop', onDrop);
    return () => {
      window.removeEventListener('dragenter', onEnter);
      window.removeEventListener('dragover', onOver);
      window.removeEventListener('dragleave', onLeave);
      window.removeEventListener('drop', onDrop);
    };
  }, []);

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
   * - 单张：直接下载
   * - 多张：打成 picthin.zip 一次性下载，文件名重复时自动追加序号
   */
  const handleDownloadAll = async () => {
    const ext = format === 'jpg' ? 'jpeg' : format;
    const done = results.filter(r => r.compressedBlob);
    if (done.length === 0) return;

    if (done.length === 1) {
      const r = done[0];
      downloadBlob(r.compressedBlob, `${r.fileName}.${ext}`);
      return;
    }

    const { default: JSZip } = await import('jszip');
    const zip = new JSZip();
    const used = new Map();
    done.forEach(r => {
      const base = `${r.fileName}.${ext}`;
      const seen = used.get(base) ?? 0;
      const name = seen === 0 ? base : `${r.fileName} (${seen}).${ext}`;
      used.set(base, seen + 1);
      zip.file(name, r.compressedBlob);
    });
    const blob = await zip.generateAsync({ type: 'blob', compression: 'STORE' });
    downloadBlob(blob, 'picthin.zip');
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
    <div className="flex flex-col h-screen w-full bg-bg overflow-hidden">
      <Head>
        <title>图片压缩工具 - 免费在线压缩 JPEG PNG WebP，本地处理不上传</title>
        <meta name="description" content="免费在线图片压缩工具，支持 JPEG、PNG、WebP、AVIF、GIF 格式，全程本地处理，不上传服务器，保护隐私。支持批量压缩，手机电脑均可使用。" />
        <meta name="keywords" content="图片压缩,在线压缩图片,PNG压缩,JPEG压缩,WebP转换,图片格式转换,免费图片压缩,批量压缩图片,图片瘦身,图片体积压缩" />
        <link rel="canonical" href="https://image-tool-bk5.pages.dev/" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://image-tool-bk5.pages.dev/" />
        <meta property="og:title" content="图片压缩工具 - 免费在线压缩 JPEG PNG WebP" />
        <meta property="og:description" content="免费在线图片压缩工具，全程本地处理，不上传服务器，保护隐私。" />
        <meta property="og:image" content="https://image-tool-bk5.pages.dev/og-image.png" />
        <meta property="og:image:alt" content="图片压缩工具 - 支持 JPEG PNG WebP AVIF 格式" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="图片压缩工具 - 免费在线压缩 JPEG PNG WebP" />
        <meta name="twitter:description" content="免费在线图片压缩工具，全程本地处理，不上传服务器，保护隐私。" />
        <meta name="twitter:image" content="https://image-tool-bk5.pages.dev/og-image.png" />
      </Head>
      {/* 浏览器兼容性提示 */}
      <BrowserCompat />

      {/* 页头 */}
      <header className="flex-shrink-0 border-b border-border bg-surface px-4 md:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <Logo size="sm" showText={true} />
            <span className="hidden md:inline text-sm text-foreground-muted truncate">智能图片压缩 • 本地处理 • 隐私优先</span>
          </div>
          <nav className="flex items-center">
            <Link
              to="/blog/png-webp-jpg-comparison"
              className="text-sm text-foreground-muted hover:text-primary transition-colors px-3 py-1.5 rounded-md hover:bg-primary-muted"
            >
              图片格式对比
            </Link>
          </nav>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="flex-1 overflow-auto w-full bg-bg">
        {selectedFiles.length === 0 ? (
          // 初始界面 - 上传页面
          <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto py-12 px-4 md:px-8">
            {/* 上传区域 */}
            <section className="flex flex-col gap-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">上传图片</h2>
                <p className="text-sm text-foreground-muted mt-1">
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
                { Icon: Zap,         title: '快速压缩',   desc: '本地秒级处理' },
                { Icon: ShieldCheck, title: '完全隐私',   desc: '不上传服务器' },
                { Icon: Palette,     title: '多格式支持', desc: 'JPEG、PNG、WebP 等' },
                { Icon: Layers,      title: '批量处理',   desc: '同时压缩多张图片' },
              ].map(({ Icon, title, desc }) => (
                <div key={title} className="p-4 rounded-lg border border-border bg-surface hover:shadow-md transition-shadow">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary-muted text-primary mb-3">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                  <p className="text-sm text-foreground-muted">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // 处理界面 - 工具栏 + 预览（PC 宽屏下居中收窄，避免列表横向拉太长）
          <div className="relative flex flex-col gap-4 h-full px-6 py-4 bg-bg w-full max-w-5xl mx-auto">
            {/* 右上角关闭按钮：即使处理中也可强制取消返回 */}
            <button
              onClick={() => {
                clearTimeout(qualityDebounceRef.current);
                ++processIdRef.current; // 取消正在进行的压缩
                setIsProcessing(false);
                selectedFilesRef.current = [];
                setSelectedFiles([]);
                setResults([]);
              }}
              className="absolute top-1 right-3 w-8 h-8 flex items-center justify-center rounded-full border border-border bg-surface text-foreground-muted hover:text-foreground hover:border-foreground transition-colors"
              title="更换图片"
            >
              <X className="w-4 h-4" strokeWidth={2.5} />
            </button>

            {/* 顶部工具栏 */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 p-4 bg-surface border border-border rounded-lg">
              {/* 文件名（仅单张时显示） */}
              {isSingleFile && (
                <div className="flex-1 flex items-center gap-2">
                  <span className="text-sm text-foreground-muted whitespace-nowrap">文件名称</span>
                  <div className="flex items-center gap-1 flex-1">
                    <div className="relative flex-1 min-w-0">
                      <input
                        ref={customNameInputRef}
                        type="text"
                        className="w-full pl-3 pr-9 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-surface"
                        value={customFileName}
                        onChange={(e) => setCustomFileName(e.target.value)}
                        placeholder="输入文件名"
                      />
                      <button
                        type="button"
                        title="编辑文件名"
                        tabIndex={-1}
                        onClick={() => {
                          const el = customNameInputRef.current;
                          if (!el) return;
                          el.focus();
                          el.select();
                        }}
                        className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center rounded text-foreground-muted hover:text-primary hover:bg-primary-muted transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-sm text-foreground-muted">.{format === 'jpg' ? 'jpeg' : format}</span>
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
                    <span className="text-sm text-foreground-muted min-w-[3rem]">{quality}%</span>
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
                    <p className="text-xs text-warning">照片转 PNG 体积会增大，建议用 WebP</p>
                  )}
                  {format === 'gif' && (
                    <p className="text-xs text-warning">无损格式，照片转换后体积会大幅增加；动态 GIF 仅保留第一帧</p>
                  )}
                </div>
              </div>
            </div>

            {/* 预览/结果区域 */}
            <div className="flex-1 bg-surface border border-border rounded-lg overflow-hidden flex flex-col">
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
                      <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm text-foreground-muted">正在处理... {progress > 0 ? `${progress}%` : ''}</p>
                      {progress > 0 && (
                        <div className="w-full max-w-xs h-1.5 bg-surface-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-150"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-3 p-4 bg-danger/10 border border-danger/20 rounded-md text-danger">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
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
      <footer className="flex-shrink-0 border-t border-border bg-surface px-8 pt-4 safe-area-bottom">
        <div className="flex items-center justify-center gap-3 text-base font-medium text-foreground">
          <span>图片仅在本地处理，不上传服务器，隐私安全有保障</span>
          <span className="w-px h-4 bg-border inline-block mx-1" aria-hidden="true" />
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

      {/* 全局拖拽提示层：拖文件到页面任意位置都接收 */}
      {isPageDragOver && (
        <div className="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-primary/15 backdrop-blur-sm">
          <div className="m-6 px-12 py-16 rounded-2xl border-4 border-dashed border-primary bg-surface/95 shadow-lg flex flex-col items-center gap-4">
            <Upload className="w-14 h-14 text-primary" strokeWidth={1.75} />
            <h3 className="text-2xl font-semibold text-foreground">释放鼠标上传图片</h3>
            <p className="text-sm text-foreground-muted">支持 JPG、PNG、GIF、WebP、AVIF，可一次拖多张</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
