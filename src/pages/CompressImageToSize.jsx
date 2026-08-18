import { useEffect, useMemo, useRef, useState } from 'react';
import { Head } from 'vite-react-ssg';
import { Link } from 'react-router-dom';
import { Download, Gauge, RefreshCw, ShieldCheck } from 'lucide-react';
import BlogLayout from '../components/BlogLayout';
import ImageUploader from '../components/ImageUploader';
import { Button } from '../components/ui/button';
import {
  calculateSavingPercentage,
  compressImageToTargetSize,
  downloadBlob,
  formatFileSize,
} from '../utils/imageProcessor';
import { getSiteUrl, SITE } from '../config/site';

const PAGE_URL = getSiteUrl('/compress-image-to-size');
const OG_IMAGE_URL = getSiteUrl('/og-image.png');
const TARGET_PRESETS = [100, 200, 500, 1024];

const FAQ_ITEMS = [
  {
    question: '为什么压缩结果通常会略小于目标值？',
    answer: '不同浏览器的图片编码结果会有少量差异。工具会预留很小的体积余量，避免下载后的文件超过你填写的上限。',
  },
  {
    question: '压缩到指定大小会降低清晰度吗？',
    answer: '文件越小，可保留的细节越少。工具会先调整编码质量，仍然过大时才缩小像素尺寸，尽量在体积和清晰度之间取得平衡。',
  },
  {
    question: '图片会上传到服务器吗？',
    answer: '不会。读取、压缩、预览和下载都在你的浏览器本地完成，图片不会离开当前设备。',
  },
];

const PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: '图片压缩到指定大小',
  description: '免费将 JPG、PNG、WebP、AVIF 图片压缩到指定 KB 或 MB，全程在浏览器本地处理。',
  url: PAGE_URL,
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Any',
  inLanguage: SITE.locale,
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

function useObjectUrl(value) {
  const url = useMemo(
    () => (value && typeof URL !== 'undefined' ? URL.createObjectURL(value) : ''),
    [value],
  );

  useEffect(() => {
    if (!url) return undefined;
    return () => URL.revokeObjectURL(url);
  }, [url]);

  return url;
}

export default function CompressImageToSize() {
  const [file, setFile] = useState(null);
  const [targetKb, setTargetKb] = useState(500);
  const [format, setFormat] = useState('jpeg');
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const processIdRef = useRef(0);

  const originalUrl = useObjectUrl(file);
  const resultUrl = useObjectUrl(result);
  const savingPercentage = useMemo(
    () => (file && result ? calculateSavingPercentage(file.size, result.size) : 0),
    [file, result],
  );

  const runCompression = async (sourceFile = file, nextTargetKb = targetKb, nextFormat = format) => {
    const parsedTarget = Number(nextTargetKb);
    if (!sourceFile) return;
    if (!Number.isFinite(parsedTarget) || parsedTarget < 20 || parsedTarget > 10240) {
      setError('请输入 20KB 到 10240KB 之间的目标大小');
      return;
    }

    const processId = ++processIdRef.current;
    setStatus('processing');
    setProgress(0);
    setResult(null);
    setError('');

    try {
      const compressed = await compressImageToTargetSize(
        sourceFile,
        Math.round(parsedTarget * 1024),
        nextFormat,
        (nextProgress) => {
          if (processIdRef.current === processId) setProgress(nextProgress);
        },
      );
      if (processIdRef.current !== processId) return;
      setResult(compressed);
      setStatus('done');
    } catch (compressionError) {
      if (processIdRef.current !== processId) return;
      setError(compressionError.message || '压缩失败，请更换图片后重试');
      setStatus('error');
    }
  };

  const handleImagesSelected = ([selectedFile]) => {
    setFile(selectedFile);
    runCompression(selectedFile);
  };

  const handleDownload = () => {
    if (!file || !result) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const extension = format === 'jpeg' ? 'jpg' : format;
    downloadBlob(result, `${baseName}-${targetKb}kb.${extension}`);
  };

  return (
    <BlogLayout>
      <Head>
        <html lang="zh-CN" />
        <title>图片压缩到指定大小 - 压到 100KB、200KB、500KB 或 1MB - picthin</title>
        <meta
          name="description"
          content="免费将 JPG、PNG、WebP、AVIF 图片压缩到指定 KB 或 MB。自动调整质量和尺寸，全程浏览器本地处理，不上传图片。"
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="图片压缩到指定大小 - picthin" />
        <meta property="og:description" content="输入目标体积，自动将图片压到 100KB、200KB、500KB 或 1MB 以内。" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="图片压缩到指定大小 - picthin" />
        <meta name="twitter:description" content="输入目标体积，自动调整画质和尺寸，全程本地处理。" />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(PAGE_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Head>

      <section className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <header className="max-w-3xl mb-8">
          <p className="text-sm text-foreground-muted mb-3">
            <Link to="/" className="hover:text-primary">首页</Link>
            <span className="mx-2">/</span>
            <span>压缩到指定大小</span>
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            图片压缩到指定大小
          </h1>
          <p className="text-base md:text-lg text-foreground-muted mt-4 leading-8">
            输入目标体积，自动把图片压缩到指定 KB 以内。工具会先优化画质，必要时再缩小尺寸；所有处理都在你的浏览器本地完成。
          </p>
        </header>

        <div className="rounded-xl border border-border bg-surface p-4 md:p-6 shadow-sm">
          <div className="grid md:grid-cols-[1fr_auto] gap-5 items-end mb-6">
            <div>
              <label htmlFor="target-size" className="block text-sm font-semibold text-foreground mb-2">
                目标文件大小
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="target-size"
                  type="number"
                  min="20"
                  max="10240"
                  step="10"
                  value={targetKb}
                  onChange={(event) => {
                    ++processIdRef.current;
                    setTargetKb(event.target.value);
                    setResult(null);
                    setStatus('idle');
                    setError('');
                  }}
                  className="w-full rounded-md border border-border bg-surface px-3 py-2.5 text-foreground focus:ring-2 focus:ring-primary focus:border-primary"
                />
                <span className="text-sm font-medium text-foreground-muted">KB</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3" aria-label="常用目标大小">
                {TARGET_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setTargetKb(preset);
                      if (file) runCompression(file, preset, format);
                    }}
                    className={`rounded-full border px-3 py-1.5 text-sm transition-colors ${
                      Number(targetKb) === preset
                        ? 'border-primary bg-primary-muted text-primary'
                        : 'border-border text-foreground-muted hover:border-primary hover:text-primary'
                    }`}
                  >
                    {preset === 1024 ? '1MB' : `${preset}KB`}
                  </button>
                ))}
              </div>
            </div>

            <fieldset>
              <legend className="block text-sm font-semibold text-foreground mb-2">输出格式</legend>
              <div className="flex rounded-md border border-border p-1 bg-surface-muted">
                {[
                  ['jpeg', 'JPG'],
                  ['webp', 'WebP'],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={format === value}
                    onClick={() => {
                      setFormat(value);
                      if (file) runCompression(file, targetKb, value);
                    }}
                    className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
                      format === value ? 'bg-surface text-primary shadow-sm' : 'text-foreground-muted hover:text-foreground'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          {!file ? (
            <ImageUploader onImagesSelected={handleImagesSelected} isMultiple={false} />
          ) : (
            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <figure className="rounded-lg border border-border bg-surface-muted overflow-hidden">
                  <div className="aspect-[4/3] flex items-center justify-center p-3">
                    {originalUrl && <img src={originalUrl} alt="原始图片预览" className="max-w-full max-h-full object-contain" />}
                  </div>
                  <figcaption className="border-t border-border bg-surface px-4 py-3 text-sm">
                    <span className="font-medium text-foreground">原始图片</span>
                    <span className="text-foreground-muted ml-2">{formatFileSize(file.size)}</span>
                  </figcaption>
                </figure>

                <figure className="rounded-lg border border-border bg-surface-muted overflow-hidden">
                  <div className="aspect-[4/3] flex items-center justify-center p-3">
                    {resultUrl ? (
                      <img src={resultUrl} alt="压缩后图片预览" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className="text-center text-foreground-muted" aria-live="polite">
                        <Gauge className="w-8 h-8 mx-auto mb-2 text-primary" />
                        {status === 'processing' ? `正在压缩 ${Math.round(progress)}%` : '等待压缩结果'}
                      </div>
                    )}
                  </div>
                  <figcaption className="border-t border-border bg-surface px-4 py-3 text-sm">
                    <span className="font-medium text-foreground">压缩结果</span>
                    <span className="text-foreground-muted ml-2">{result ? formatFileSize(result.size) : '—'}</span>
                  </figcaption>
                </figure>
              </div>

              {status === 'processing' && (
                <div className="h-2 overflow-hidden rounded-full bg-surface-muted" aria-label={`压缩进度 ${Math.round(progress)}%`}>
                  <div className="h-full bg-primary transition-all" style={{ width: `${Math.max(4, progress)}%` }} />
                </div>
              )}

              {error && (
                <p className="rounded-md border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
                  {error}
                </p>
              )}

              {result && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-lg bg-primary-muted px-4 py-4">
                  <div>
                    <p className="font-semibold text-foreground">
                      已压缩到 {formatFileSize(result.size)}
                    </p>
                    <p className="text-sm text-foreground-muted mt-1">
                      {savingPercentage >= 0 ? `比原图节省 ${savingPercentage}%` : '原图已很小，本次主要完成格式转换'}
                    </p>
                  </div>
                  <Button onClick={handleDownload} className="md:min-w-36">
                    <Download className="w-4 h-4 mr-2" />
                    下载图片
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  onClick={() => runCompression()}
                  disabled={status === 'processing'}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  按当前设置重新压缩
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    ++processIdRef.current;
                    setFile(null);
                    setResult(null);
                    setStatus('idle');
                    setError('');
                  }}
                  className="text-sm text-foreground-muted hover:text-primary px-2"
                >
                  更换图片
                </button>
              </div>
            </div>
          )}

          <p className="flex items-center gap-2 text-xs text-foreground-muted mt-4">
            <ShieldCheck className="w-4 h-4 text-success" />
            图片只在当前设备中处理，不会上传到服务器。JPG 输出不保留透明背景，透明图片建议选择 WebP。
          </p>
        </div>

        <article className="blog-article mt-12">
          <h2>怎样把图片压到指定 KB？</h2>
          <p>
            只降低质量并不总能达到目标体积。PicThin 会先在保持原始尺寸的前提下调整编码质量；如果图片仍然过大，再逐步缩小像素尺寸。相比一次把质量拉得很低，这种方法通常能保留更多可见细节。
          </p>

          <h2>常见目标大小怎么选</h2>
          <ul>
            <li><strong>100KB–200KB：</strong>适合头像、小尺寸预览图和对上传体积要求较严格的表单。</li>
            <li><strong>500KB：</strong>适合邮件附件、网页配图和多数日常分享场景。</li>
            <li><strong>1MB：</strong>适合希望保留较高分辨率和较多照片细节的情况。</li>
          </ul>
          <p>
            如果目标体积非常小，而原图来自手机相机，缩小尺寸通常比持续降低 JPG 质量更有效。想了解具体判断方法，可以继续阅读
            {' '}<Link to="/blog/jpg-compress-to-target-size">JPG 图片怎么压缩到指定大小</Link>。
          </p>

          <h2>常见问题</h2>
          {FAQ_ITEMS.map((item) => (
            <section key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </section>
          ))}
        </article>
      </section>
    </BlogLayout>
  );
}
