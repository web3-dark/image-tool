import { useMemo, useRef, useState } from 'react';
import { Head } from 'vite-react-ssg';
import { Link } from 'react-router-dom';
import { Download, MapPinOff, RefreshCw, ShieldCheck } from 'lucide-react';
import BlogLayout from '../components/BlogLayout';
import ImageUploader from '../components/ImageUploader';
import { Button } from '../components/ui/button';
import {
  calculateSavingPercentage,
  downloadBlob,
  formatFileSize,
  stripImageMetadata,
} from '../utils/imageProcessor';
import { getSiteUrl, SITE } from '../config/site';
import { useObjectUrl } from '../hooks/useObjectUrl';

const PAGE_URL = getSiteUrl('/remove-image-metadata');
const OG_IMAGE_URL = getSiteUrl('/og-image.png');
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const FAQ_ITEMS = [
  {
    question: '会清除哪些照片信息？',
    answer: '工具会重新编码图片，因此新文件不再携带原文件中的 EXIF、GPS 位置、拍摄时间、相机型号和编辑软件等文件级元数据。',
  },
  {
    question: '清除元数据会改变画面吗？',
    answer: 'PNG 会以无损格式重新输出；JPG 和 WebP 会进行一次高质量重新编码，通常难以察觉，但文件大小可能增加或减少。请始终保留原图。',
  },
  {
    question: '原图会上传到服务器吗？',
    answer: '不会。读取、重新编码、预览和下载全部在当前浏览器中完成，PicThin 不会接收照片内容。',
  },
];

const SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '清除照片 EXIF 和 GPS 信息',
    description: '免费在浏览器本地清除 JPG、PNG、WebP 图片中的 EXIF、GPS 位置和相机信息，图片不上传服务器。',
    url: PAGE_URL,
    applicationCategory: 'SecurityApplication',
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
      { '@type': 'ListItem', position: 3, name: '清除图片元数据', item: PAGE_URL },
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  },
];

export default function RemoveImageMetadata() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const processIdRef = useRef(0);
  const originalUrl = useObjectUrl(file);
  const resultUrl = useObjectUrl(result);
  const sizeChange = useMemo(
    () => (file && result ? calculateSavingPercentage(file.size, result.size) : 0),
    [file, result],
  );

  const processFile = async (sourceFile = file) => {
    if (!sourceFile) return;
    const processId = ++processIdRef.current;
    setStatus('processing');
    setResult(null);
    setError('');

    try {
      const cleaned = await stripImageMetadata(sourceFile);
      if (processIdRef.current !== processId) return;
      setResult(cleaned);
      setStatus('done');
    } catch (processingError) {
      if (processIdRef.current !== processId) return;
      setError(processingError.message || '清除元数据失败，请更换图片后重试');
      setStatus('error');
    }
  };

  const handleImagesSelected = ([selectedFile]) => {
    setFile(selectedFile);
    processFile(selectedFile);
  };

  const handleDownload = () => {
    if (!file || !result) return;
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const extension = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1];
    downloadBlob(result, `${baseName}-no-metadata.${extension}`);
  };

  const reset = () => {
    ++processIdRef.current;
    setFile(null);
    setResult(null);
    setStatus('idle');
    setError('');
  };

  return (
    <BlogLayout>
      <Head>
        <html lang="zh-CN" />
        <title>清除照片 EXIF 和 GPS 信息 - 本地处理不上传 - PicThin</title>
        <meta name="description" content="免费清除 JPG、PNG、WebP 图片中的 EXIF、GPS 位置、拍摄时间和相机信息。浏览器本地处理，照片不上传服务器。" />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="清除照片 EXIF 和 GPS 信息 - PicThin" />
        <meta property="og:description" content="分享照片前清除位置和拍摄设备信息，全程浏览器本地处理。" />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="清除照片 EXIF 和 GPS 信息 - PicThin" />
        <meta name="twitter:description" content="分享照片前清除位置和拍摄设备信息，全程浏览器本地处理。" />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
        {SCHEMAS.map((schema, index) => (
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
            <span>清除图片元数据</span>
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            清除照片 EXIF 和 GPS 信息
          </h1>
          <p className="text-base md:text-lg text-foreground-muted mt-4 leading-8">
            分享证件、合同截图或私人照片前，生成一份不携带原始位置、拍摄时间和设备信息的新图片。文件全程留在当前浏览器。
          </p>
        </header>

        <div className="rounded-xl border border-border bg-surface p-4 md:p-6 shadow-sm">
          {!file ? (
            <ImageUploader
              onImagesSelected={handleImagesSelected}
              isMultiple={false}
              acceptedTypes={ACCEPTED_TYPES}
              supportedText="JPG、PNG、WebP"
            />
          ) : (
            <div className="space-y-5">
              <div className="grid md:grid-cols-2 gap-4">
                <figure className="rounded-lg border border-border bg-surface-muted overflow-hidden">
                  <div className="aspect-[4/3] flex items-center justify-center p-3">
                    {originalUrl && <img src={originalUrl} alt="原始图片预览" className="max-w-full max-h-full object-contain" />}
                  </div>
                  <figcaption className="border-t border-border bg-surface px-4 py-3 text-sm">
                    <span className="font-medium text-foreground">原始文件</span>
                    <span className="text-foreground-muted ml-2">{formatFileSize(file.size)}</span>
                  </figcaption>
                </figure>

                <figure className="rounded-lg border border-border bg-surface-muted overflow-hidden">
                  <div className="aspect-[4/3] flex items-center justify-center p-3">
                    {resultUrl ? (
                      <img src={resultUrl} alt="清除元数据后的图片预览" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <div className="text-center text-foreground-muted" aria-live="polite">
                        <MapPinOff className="w-8 h-8 mx-auto mb-2 text-primary" />
                        {status === 'processing' ? '正在清除元数据…' : '等待处理结果'}
                      </div>
                    )}
                  </div>
                  <figcaption className="border-t border-border bg-surface px-4 py-3 text-sm">
                    <span className="font-medium text-foreground">无元数据副本</span>
                    <span className="text-foreground-muted ml-2">{result ? formatFileSize(result.size) : '—'}</span>
                  </figcaption>
                </figure>
              </div>

              {error && (
                <p className="rounded-md border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger" role="alert">
                  {error}
                </p>
              )}

              {result && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-lg bg-primary-muted px-4 py-4">
                  <div>
                    <p className="font-semibold text-foreground">已生成不携带原始元数据的新图片</p>
                    <p className="text-sm text-foreground-muted mt-1">
                      {sizeChange >= 0
                        ? `文件体积同时减少 ${sizeChange}%`
                        : `重新编码后体积增加 ${Math.abs(sizeChange)}%，清除元数据不保证文件更小`}
                    </p>
                  </div>
                  <Button onClick={handleDownload} className="md:min-w-40">
                    <Download className="w-4 h-4 mr-2" />
                    下载无元数据图片
                  </Button>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => processFile()} disabled={status === 'processing'}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  重新处理
                </Button>
                <button type="button" onClick={reset} className="text-sm text-foreground-muted hover:text-primary px-2">
                  更换图片
                </button>
              </div>
            </div>
          )}

          <p className="flex items-center gap-2 text-xs text-foreground-muted mt-4">
            <ShieldCheck className="w-4 h-4 text-success" />
            原始图片与处理结果都不会上传。请保留原文件，无元数据副本适合分享和提交，不建议替代唯一原件。
          </p>
        </div>

        <article className="blog-article mt-12">
          <h2>照片为什么可能包含位置信息？</h2>
          <p>
            手机和相机会把拍摄时间、设备型号、方向参数，有时还包括 GPS 经纬度写进图片元数据。聊天软件或平台可能会主动删除这些信息，但不能假设所有接收方都会这样处理。
          </p>

          <h2>PicThin 怎样清除元数据</h2>
          <p>
            浏览器先在当前设备解码图片像素，再生成一个新的 JPG、PNG 或 WebP 文件。新文件只保留画面和必要的格式信息，不复制原文件中的 EXIF、GPS 或相机信息。整个过程不需要把图片传给服务器。
          </p>

          <h2>常见问题</h2>
          {FAQ_ITEMS.map((item) => (
            <section key={item.question}>
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </section>
          ))}

          <h2>继续减小文件体积</h2>
          <p>
            清除元数据的主要目的不是压缩。如果还需要符合上传上限，可以继续使用
            {' '}<Link to="/compress-image-to-100kb">压缩到 100KB</Link>、
            <Link to="/compress-image-to-200kb">压缩到 200KB</Link> 或
            {' '}<Link to="/compress-image-to-size">自定义目标大小</Link>。
          </p>
        </article>
      </section>
    </BlogLayout>
  );
}
