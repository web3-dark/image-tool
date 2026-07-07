import { Link } from 'react-router-dom';
import { Head } from 'vite-react-ssg';
import BlogLayout from '../../components/BlogLayout';
import { BLOG_POSTS } from '../../config/content';
import { getSiteUrl, SITE } from '../../config/site';

const POST = BLOG_POSTS.find((post) => post.path === '/blog/jpg-compress-to-target-size');
const PAGE_URL = getSiteUrl(POST.path);
const OG_IMAGE_URL = getSiteUrl('/og-image.png');

const ARTICLE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: POST.title,
  description: POST.description,
  image: OG_IMAGE_URL,
  datePublished: POST.datePublished,
  dateModified: POST.dateModified,
  author: { '@type': 'Organization', name: SITE.name },
  publisher: {
    '@type': 'Organization',
    name: SITE.name,
    logo: { '@type': 'ImageObject', url: getSiteUrl('/pwa-192x192.png') },
  },
  mainEntityOfPage: { '@type': 'WebPage', '@id': PAGE_URL },
  inLanguage: SITE.locale,
};

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '为什么不能一次保证压缩到刚好 1MB？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'JPG 体积受画面复杂度、尺寸、质量和编码器影响，同样的质量参数在不同图片上会得到不同体积。更可靠的方法是先用推荐质量压一次，再根据结果逐步调整。',
      },
    },
    {
      '@type': 'Question',
      name: '压缩 JPG 时先调质量还是先缩尺寸？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '如果只是上传证件、报名表、作业平台，优先降低质量；如果图片像素很大但只在屏幕上查看，再缩小尺寸。两者结合通常最稳。',
      },
    },
    {
      '@type': 'Question',
      name: 'JPG 转 WebP 会更小吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '多数照片转成 WebP 会更小，但有些平台只接受 JPG。上传前先看平台限制，如果允许 WebP，可以优先尝试 WebP。',
      },
    },
  ],
};

export default function JpgCompressToTargetSize() {
  return (
    <BlogLayout>
      <Head>
        <html lang="zh-CN" />
        <title>JPG 图片怎么压缩到指定大小？压到 1MB / 500KB 的实用方法 - picthin</title>
        <meta name="description" content={POST.description} />
        <meta name="keywords" content={POST.keywords} />
        <link rel="canonical" href={PAGE_URL} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content="JPG 图片怎么压缩到指定大小" />
        <meta property="og:description" content={POST.description} />
        <meta property="og:url" content={PAGE_URL} />
        <meta property="og:image" content={OG_IMAGE_URL} />
        <meta property="article:published_time" content={POST.datePublished} />
        <meta property="article:modified_time" content={POST.dateModified} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="JPG 图片怎么压缩到指定大小" />
        <meta name="twitter:description" content={POST.description} />
        <meta name="twitter:image" content={OG_IMAGE_URL} />
        <script type="application/ld+json">{JSON.stringify(ARTICLE_SCHEMA)}</script>
        <script type="application/ld+json">{JSON.stringify(FAQ_SCHEMA)}</script>
      </Head>

      <article className="blog-article max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <header className="mb-10">
          <p className="text-sm text-foreground-muted mb-3">
            <Link to="/" className="hover:text-primary">首页</Link>
            <span className="mx-2">/</span>
            <Link to="/blog" className="hover:text-primary">博客</Link>
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            JPG 图片怎么压缩到指定大小？
          </h1>
          <p className="text-sm text-foreground-muted mt-4">
            更新于 {POST.dateModified}
          </p>
        </header>

        <p className="lead">
          想把 JPG 压缩到 1MB、500KB 或 200KB 以下，核心不是找一个神奇按钮，而是同时控制三件事：图片质量、图片尺寸、输出格式。最稳的做法是先压一次，看结果，再按目标大小微调。
        </p>

        <h2>最快方法：先用质量滑杆试一次</h2>
        <p>
          如果原图是手机拍的照片，第一步通常不用改尺寸，先把 JPG 质量调到 70%-80%。这个范围对照片比较友好，文件体积会明显下降，肉眼细节通常还能保住。
        </p>
        <p>
          可以直接打开 <Link to="/" className="text-primary hover:underline font-medium">picthin 图片压缩工具</Link>，上传图片后选择 JPG 输出，调整压缩质量，再看压缩后的体积。如果还没到目标大小，再逐步降到 60%、50%。
        </p>

        <h2>常见目标大小怎么调</h2>
        <p>
          不同照片内容差异很大，下面不是绝对值，而是一个实用起点。风景、合照这类细节多的图片会更难压；白底证件、截图、文档照片通常更容易压小。
        </p>
        <div className="overflow-x-auto my-6">
          <table>
            <thead>
              <tr>
                <th>目标体积</th>
                <th>建议起点</th>
                <th>适合场景</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1MB 以下</td>
                <td>JPG 质量 75%-85%</td>
                <td>作业上传、网页配图、普通照片</td>
              </tr>
              <tr>
                <td>500KB 以下</td>
                <td>JPG 质量 60%-75%</td>
                <td>报名表、资料提交、移动端分享</td>
              </tr>
              <tr>
                <td>200KB 以下</td>
                <td>JPG 质量 40%-60%，必要时缩小尺寸</td>
                <td>头像、证件照预览、小图上传</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>如果质量已经很低，下一步缩小尺寸</h2>
        <p>
          很多手机照片有 3000-6000 像素宽，但上传平台只是在网页或 App 里查看。此时继续把 JPG 质量压到很低，容易出现色块和糊边；更好的做法是把尺寸缩小，再保持中等质量。
        </p>
        <p>
          举个例子：一张 4000 像素宽的照片，如果只是用于资料上传，缩到 1600-2000 像素宽通常已经足够清楚。尺寸下降后，再用 70% 左右的质量压缩，往往比硬降到 30% 更自然。
        </p>

        <h2>JPG、PNG、WebP 要不要换格式</h2>
        <p>
          如果图片本身是照片，JPG 仍然是兼容性最好的选择；如果平台允许 WebP，可以试试 WebP，它经常能在相近画质下比 JPG 更小。PNG 不适合压照片，除非你需要透明背景或非常锐利的截图文字。
        </p>
        <p>
          对格式选择还不确定的话，可以看这篇：<Link to="/blog/png-webp-jpg-comparison" className="text-primary hover:underline font-medium">PNG、JPG、WebP、AVIF 完整对比</Link>。
        </p>

        <h2>压缩时怎么判断画质还够不够</h2>
        <p>
          只看文件大小不够，最好放大检查三处：人物脸部边缘、文字边缘、颜色渐变区域。如果这些地方出现明显马赛克、色块或文字毛边，说明质量压得太低，需要稍微调高质量或缩小尺寸后重新压。
        </p>

        <h2>常见问题（FAQ）</h2>

        <h3>为什么不能一次保证压缩到刚好 1MB？</h3>
        <p>
          JPG 体积受画面复杂度、尺寸、质量和编码器影响。同样设置下，纯色截图可能很小，树叶、头发、草地这类细节很多的照片会明显更大。所以更可靠的方法是压一次、看体积、再微调。
        </p>

        <h3>先调质量还是先缩尺寸？</h3>
        <p>
          如果图片尺寸不大，先调质量；如果图片来自手机原图，宽度动辄几千像素，先缩尺寸通常更划算。两者结合比单纯把质量拉到很低更稳。
        </p>

        <h3>本地压缩和上传压缩有什么区别？</h3>
        <p>
          本地压缩是在浏览器里完成，图片不会离开你的设备，适合处理证件照、作业、合同截图等比较私密的图片。上传压缩则需要把图片发到服务器，速度和隐私都取决于服务提供方。
        </p>

        <h2>小结</h2>
        <p>
          想压到指定大小，先从 JPG 质量 70%-80% 开始；还太大就降到 60% 左右；如果仍然超标，优先缩小尺寸，而不是继续把质量压到很低。这样通常能在体积和清晰度之间取得更好的平衡。
        </p>
        <p>
          现在可以回到 <Link to="/" className="text-primary hover:underline font-medium">picthin 图片压缩工具</Link> 试一张图，边调质量边看压缩后的文件大小。
        </p>
      </article>
    </BlogLayout>
  );
}
