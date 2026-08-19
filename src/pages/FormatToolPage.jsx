import { useMemo, useRef, useState } from 'react';
import { Head } from 'vite-react-ssg';
import { Link } from 'react-router-dom';
import { Download, RefreshCw, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import BlogLayout from '../components/BlogLayout';
import ImageUploader from '../components/ImageUploader';
import { Button } from '../components/ui/button';
import {
  calculateSavingPercentage,
  compressImage,
  downloadBlob,
  formatFileSize,
} from '../utils/imageProcessor';
import { getSiteUrl, SITE } from '../config/site';
import { useObjectUrl } from '../hooks/useObjectUrl';

export default function FormatToolPage({ tool }) {
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(tool.defaultQuality);
  const [result, setResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const processIdRef = useRef(0);

  const originalUrl = useObjectUrl(file);
  const resultUrl = useObjectUrl(result);
  const pageUrl = getSiteUrl(tool.path);
  const ogImageUrl = getSiteUrl('/og-image.png');
  const isCompressionTool = tool.path.startsWith('/compress-');
  const savingPercentage = useMemo(
    () => (file && result ? calculateSavingPercentage(file.size, result.size) : 0),
    [file, result],
  );

  const schemas = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: tool.title,
      description: tool.description,
      url: pageUrl,
      applicationCategory: 'MultimediaApplication',
      operatingSystem: 'Any',
      inLanguage: SITE.locale,
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '首页', item: getSiteUrl('/') },
        { '@type': 'ListItem', position: 2, name: '图片工具', item: getSiteUrl('/tools') },
        { '@type': 'ListItem', position: 3, name: tool.shortTitle, item: pageUrl },
      ],
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: tool.faq.map(([question, answer]) => ({
        '@type': 'Question',
        name: question,
        acceptedAnswer: { '@type': 'Answer', text: answer },
      })),
    },
  ];

  const processFile = async (sourceFile = file, nextQuality = quality) => {
    if (!sourceFile) return;
    const processId = ++processIdRef.current;
    setStatus('processing');
    setProgress(0);
    setResult(null);
    setError('');

    try {
      const processed = await compressImage(
        sourceFile,
        Number(nextQuality) / 100,
        tool.outputFormat,
        (nextProgress) => {
          if (processIdRef.current === processId) setProgress(nextProgress);
        },
      );
      if (processIdRef.current !== processId) return;

      const finalResult = isCompressionTool && processed.size >= sourceFile.size
        ? sourceFile
        : processed;
      setResult(finalResult);
      setStatus('done');
      setProgress(100);
    } catch (processingError) {
      if (processIdRef.current !== processId) return;
      setError(processingError.message || '图片处理失败，请更换图片后重试');
      setStatus('error');
    }
  };

  const handleImagesSelected = ([selectedFile]) => {
    setFile(selectedFile);
    processFile(selectedFile);
  };

  const resetResultForQuality = (nextQuality) => {
    ++processIdRef.current;
    setQuality(nextQuality);
    setResult(null);
    setStatus('idle');
    setError('');
  };

  const handleDownload = () => {
    if (!file || !result) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const extension = tool.outputFormat === 'jpeg' ? 'jpg' : tool.outputFormat;
    const suffix = isCompressionTool ? 'compressed' : `to-${extension}`;
    downloadBlob(result, `${baseName}-${suffix}.${extension}`);
  };

  return (
    <BlogLayout>
      <Head>
        <html lang="zh-CN" />
        <title>{tool.seoTitle}</title>
        <meta name="description" content={tool.description} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${tool.title} - PicThin`} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={ogImageUrl} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${tool.title} - PicThin`} />
        <meta name="twitter:description" content={tool.description} />
        <meta name="twitter:image" content={ogImageUrl} />
        {schemas.map((schema, index) => (
          <script key={index} type="application/ld+json">{JSON.stringify(schema)}</script>
        ))}
      </Head>

      <section className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <header className="max-w-3xl mb-8">
          <p className="text-sm text-foreground-muted mb-3">
            <Link to="/" className="hover:text-primary">首页</Link>
            <span className="mx-2">/</span>
            <Link to="/tools" className="hover:text-primary">图片工具</Link>
            <span className="mx-2">/</span>
            <span>{tool.shortTitle}</span>
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {tool.title}
          </h1>
          <p className="text-base md:text-lg text-foreground-muted mt-4 leading-8">
            {tool.lead}
          </p>
        </header>

        <div className="rounded-xl border border-border bg-surface p-4 md:p-6 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center justify-between gap-4 mb-2">
              <label htmlFor={`${tool.path.slice(1)}-quality`} className="text-sm font-semibold text-foreground">
                输出质量
              </label>
              <span className="text-sm font-semibold text-primary">{quality}%</span>
            </div>
            <input
              id={`${tool.path.slice(1)}-quality`}
              type="range"
              min="20"
              max="100"
              step="1"
              value={quality}
              onChange={(event) => resetResultForQuality(Number(event.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs text-foreground-muted mt-1">
              <span>更小文件</span>
              <span>更高画质</span>
            </div>
          </div>

          {!file ? (
            <ImageUploader
              onImagesSelected={handleImagesSelected}
              isMultiple={false}
              acceptedTypes={tool.inputTypes}
              supportedText={tool.acceptedLabel}
            />
          ) : (
            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <figure className="rounded-lg border border-border bg-surface-muted overflow-hidden">
                  <div className="aspect-[4/3] flex items-center justify-center p-3">
                    {originalUrl && <img src={originalUrl} alt={`${tool.acceptedLabel} 原始图片预览`} className="max-w-full max-h-full object-contain" />}
                  </div>
                  <figcaption className="border-t border-border bg-surface px-4 py-3 text-sm">
                    <span className="font-medium text-foreground">原始图片</span>
                    <span className="text-foreground-muted ml-2">{formatFileSize(file.size)}</span>
                  </figcaption>
                </figure>

                <figure className="rounded-lg border border-border bg-surface-muted overflow-hidden">
                  <div className="aspect-[4/3] flex items-center justify-center p-3">
                    {resultUrl ? (
                      <img src={resultUrl} alt={`${tool.outputLabel} 处理结果预览`} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className="text-center text-foreground-muted" aria-live="polite">
                        <SlidersHorizontal className="w-8 h-8 mx-auto mb-2 text-primary" />
                        {status === 'processing' ? `正在处理 ${Math.round(progress)}%` : '调整质量后重新处理'}
                      </div>
                    )}
                  </div>
                  <figcaption className="border-t border-border bg-surface px-4 py-3 text-sm">
                    <span className="font-medium text-foreground">{tool.outputLabel} 结果</span>
                    <span className="text-foreground-muted ml-2">{result ? formatFileSize(result.size) : '—'}</span>
                  </figcaption>
                </figure>
              </div>

              {status === 'processing' && (
                <div className="h-2 overflow-hidden rounded-full bg-surface-muted" aria-label={`处理进度 ${Math.round(progress)}%`}>
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
                    <p className="font-semibold text-foreground">处理完成：{formatFileSize(result.size)}</p>
                    <p className="text-sm text-foreground-muted mt-1">
                      {savingPercentage >= 0
                        ? `比原图节省 ${savingPercentage}%`
                        : `转换后的 ${tool.outputLabel} 比原文件大 ${Math.abs(savingPercentage)}%`}
                    </p>
                  </div>
                  <Button onClick={handleDownload} className="md:min-w-36">
                    <Download className="w-4 h-4 mr-2" />
                    下载 {tool.outputLabel}
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => processFile()} disabled={status === 'processing'}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  {tool.actionLabel}
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
            图片在当前浏览器中处理，不会上传到 PicThin 或第三方服务器。
          </p>
        </div>

        <article className="blog-article mt-12">
          <h2>{tool.shortTitle}的特点</h2>
          <div className="grid md:grid-cols-3 gap-4 not-prose">
            {tool.benefits.map(([title, description]) => (
              <section key={title} className="rounded-lg border border-border bg-surface p-4">
                <h3 className="font-semibold text-foreground !text-base !mt-0 !mb-2">{title}</h3>
                <p className="!text-sm !text-foreground-muted !leading-6 !mb-0">{description}</p>
              </section>
            ))}
          </div>

          <h2>适合哪些场景</h2>
          <ul>
            {tool.useCases.map((useCase) => <li key={useCase}>{useCase}</li>)}
          </ul>

          <h2>常见问题</h2>
          {tool.faq.map(([question, answer]) => (
            <section key={question}>
              <h3>{question}</h3>
              <p>{answer}</p>
            </section>
          ))}

          <h2>相关工具和指南</h2>
          <p>
            需要控制最终文件体积时，可以使用 <Link to="/compress-image-to-size">图片压缩到指定大小</Link>；
            想了解不同编码格式的区别，可以阅读 <Link to="/blog/png-webp-jpg-comparison">PNG、JPG、WebP、AVIF 完整对比</Link>。
          </p>
        </article>
      </section>
    </BlogLayout>
  );
}
