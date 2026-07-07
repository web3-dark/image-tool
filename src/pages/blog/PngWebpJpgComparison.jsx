import { useState } from 'react';
import { Link } from 'react-router-dom';
import BlogPostShell from '../../components/blog/BlogPostShell';
import ImageModal from '../../components/ImageModal';
import { getBlogPost } from '../../config/content';

const POST = getBlogPost('/blog/png-webp-jpg-comparison');

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'WebP 在微信里能正常显示吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '微信内置浏览器从 2020 年起已经支持 WebP，朋友圈和公众号文章里的 WebP 都能正常显示。但用户长按"保存图片"时，部分老版本微信会自动转成 JPG，可能导致画质损失。如果分享场景需要让用户保存原图，建议直接用 JPG。',
      },
    },
    {
      '@type': 'Question',
      name: 'PNG 和 SVG 怎么选？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'SVG 是矢量格式，无限放大不糊，适合图标、Logo、简单图形。PNG 是位图格式，适合截图、复杂插画、需要透明背景的实拍图。一句话：能用 SVG 就用 SVG，不能用 SVG 才用 PNG。',
      },
    },
    {
      '@type': 'Question',
      name: '为什么我的 JPG 越压越糊？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'JPG 是有损压缩，每次重新保存都会再丢一次细节，多次保存会叠加成肉眼可见的"马赛克"和色块。要避免：保留一份高质量原图，每次都从原图压缩，而不是从已压过的 JPG 继续压。',
      },
    },
    {
      '@type': 'Question',
      name: 'WebP 会取代 PNG 和 JPG 吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '短期内不会。PNG 和 JPG 已经是事实标准，所有系统、所有软件都原生支持，迁移成本极高。WebP 会逐渐成为 Web 端的首选，但桌面和移动端的本地图片场景，PNG 和 JPG 还会长期存在。',
      },
    },
    {
      '@type': 'Question',
      name: '苹果设备支持 WebP 吗？',
      acceptedAnswer: {
        '@type': 'Answer',
        text: '支持。Safari 从 14（iOS 14 / macOS Big Sur，2020 年 9 月发布）开始原生支持 WebP。到 2026 年，几乎所有在用的 iPhone、iPad、Mac 都能正常显示 WebP，可以放心使用。',
      },
    },
  ],
};

export default function PngWebpJpgComparison() {
  const [preview, setPreview] = useState(null);
  const openPreview = (src, title) => setPreview({ src, title });
  const closePreview = () => setPreview(null);

  const imageModal = (
    <ImageModal
      isOpen={!!preview}
      imageUrl={preview?.src}
      imageTitle={preview?.title}
      onClose={closePreview}
    />
  );

  return (
    <BlogPostShell post={POST} extraSchemas={[FAQ_SCHEMA]} afterArticle={imageModal}>
        <p className="lead">
          PNG 适合需要透明背景或锐利线条的图（图标、截图、UI 切图）；JPG 适合照片；WebP 比两者都小，主流浏览器都支持，是 2026 年 Web 端的首选；AVIF 比 WebP 更小，但兼容性还差最后一公里。下面这篇文章会把这四种格式（外加 GIF）的压缩原理、文件大小、浏览器兼容性、使用场景一次讲透，看完你就能在任何场景下做出正确选择。
        </p>

        <h2>这些格式的核心区别（快速对照表）</h2>
        <p>
          如果你只想知道结论，看这张表就够了。每一项后面的章节会详细解释为什么。
        </p>
        <div className="overflow-x-auto my-6">
          <table>
            <thead>
              <tr>
                <th>格式</th>
                <th>压缩类型</th>
                <th>透明</th>
                <th>相对体积</th>
                <th>典型场景</th>
                <th>浏览器支持</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>PNG</strong></td>
                <td>无损</td>
                <td>✅ 完整 Alpha</td>
                <td>大</td>
                <td>图标、截图、线条</td>
                <td>100%</td>
              </tr>
              <tr>
                <td><strong>JPG</strong></td>
                <td>有损</td>
                <td>❌</td>
                <td>中</td>
                <td>照片</td>
                <td>100%</td>
              </tr>
              <tr>
                <td><strong>WebP</strong></td>
                <td>有损 + 无损</td>
                <td>✅</td>
                <td>小</td>
                <td>Web 通用</td>
                <td>97%+</td>
              </tr>
              <tr>
                <td><strong>AVIF</strong></td>
                <td>有损为主</td>
                <td>✅</td>
                <td>最小</td>
                <td>Web 新生代</td>
                <td>92%+</td>
              </tr>
              <tr>
                <td><strong>GIF</strong></td>
                <td>无损</td>
                <td>单色（1-bit）</td>
                <td>大</td>
                <td>动图（已过时）</td>
                <td>100%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          数据来源：caniuse.com（2026 年 5 月）。"相对体积"是同一张照片以默认参数压缩后的近似体积排序，实际差异跟图片内容关系很大，照片差距大、纯色图标差距小。
        </p>

        <figure>
          <img src="/img/format-size-comparison.svg" alt="同一张 3000×2000 风景照片在 PNG、JPG、WebP、AVIF 下的文件大小对比：PNG 8.2 MB，JPG 580 KB，WebP 380 KB，AVIF 240 KB" width="800" height="380" loading="lazy" />
          <figcaption>同一张照片 · 不同格式 · 体积相差几十倍。PNG 无损压缩照片几乎无效，AVIF 体积最小。</figcaption>
        </figure>

        <p>
          上面是示意，下面是真刀真枪的实测。我把同一张 1200×750 的风景照转成 4 种格式（参数都是各格式的"日常优质设置"），结果一目了然：
        </p>

        <div className="format-demo-grid">
          <figure className="format-demo-card">
            <img src="/img/demo/landscape.png" alt="风景照 PNG 无损版本，体积 1334 KB" loading="lazy" onClick={() => openPreview('/img/demo/landscape.png', 'PNG 无损 · 1334 KB')} />
            <figcaption><strong>PNG 无损</strong><span>1334 KB</span></figcaption>
          </figure>
          <figure className="format-demo-card">
            <img src="/img/demo/landscape-q80.jpg" alt="风景照 JPG 80% 质量版本，体积 112 KB" loading="lazy" onClick={() => openPreview('/img/demo/landscape-q80.jpg', 'JPG q80 · 112 KB')} />
            <figcaption><strong>JPG q80</strong><span>112 KB</span></figcaption>
          </figure>
          <figure className="format-demo-card">
            <img src="/img/demo/landscape-q75.webp" alt="风景照 WebP 75% 质量版本，体积 94 KB" loading="lazy" onClick={() => openPreview('/img/demo/landscape-q75.webp', 'WebP q75 · 94 KB')} />
            <figcaption><strong>WebP q75</strong><span>94 KB</span></figcaption>
          </figure>
          <figure className="format-demo-card">
            <img src="/img/demo/landscape-q45.avif" alt="风景照 AVIF 45% 质量版本，体积 54 KB" loading="lazy" onClick={() => openPreview('/img/demo/landscape-q45.avif', 'AVIF q45 · 54 KB')} />
            <figcaption><strong>AVIF q45</strong><span>54 KB</span></figcaption>
          </figure>
        </div>
        <p className="format-demo-note">
          四张图肉眼几乎看不出区别（可以右键放大查看），但 AVIF 比 PNG 小了 <strong>24 倍</strong>，比 JPG 还要再小一半。这就是为什么 Web 端值得切换到新格式。
        </p>

        <h2>有损压缩 vs 无损压缩（原理基础）</h2>
        <p>
          要看懂后面所有格式的差异，先得理解压缩世界里最基础的两个流派：<strong>有损</strong>和<strong>无损</strong>。
        </p>
        <p>
          打个最直观的比方：你听过 MP3 和 FLAC 吗？MP3 是有损，它会主动丢掉人耳不敏感的高频和低频，把一首 50 MB 的歌压成 5 MB，听起来差不多；FLAC 是无损，它只是用更聪明的方式把数据重新打包，解压后能完全还原原始波形，体积可能也就压到 30 MB。
        </p>
        <p>
          图片压缩是同一回事。无损压缩（PNG、GIF）保证每一个像素都跟原图一模一样，靠的是发现重复的数据模式然后压缩存储；有损压缩（JPG、WebP 有损模式、AVIF）允许丢掉一部分人眼难以察觉的细节，换来体积大幅缩小。
        </p>
        <p>
          这里有一个关键观点：<strong>无损不等于"高质量"，有损不等于"低质量"</strong>。一张照片用 JPG 80% 质量压缩，体积只有 PNG 的 1/5 到 1/10，但肉眼几乎看不出差别；同一张照片如果硬要用 PNG，体积大得离谱，画质并不会更好。压缩方式的选择，本质上是匹配图片内容的特征。
        </p>

        <figure>
          <img src="/img/lossy-vs-lossless.svg" alt="有损压缩与无损压缩原理对比：无损完整还原每个像素，有损主动丢掉细节换取更小体积" width="800" height="360" loading="lazy" />
          <figcaption>左：无损压缩还原后跟原图一模一样。右：有损压缩用更少的颜色和块来近似原图。</figcaption>
        </figure>

        <h2>PNG 是怎么工作的（无损压缩的代表）</h2>
        <p>
          PNG（Portable Network Graphics）诞生于 1996 年，最初是为了替代专利受限的 GIF 而生。它是 Web 时代第一个被广泛采用的开放无损格式，30 年过去了，它依然是图标、截图、UI 切图的首选。
        </p>

        <h3>DEFLATE 算法是什么</h3>
        <p>
          PNG 的压缩核心是一个叫 <strong>DEFLATE</strong> 的算法（也是 ZIP、gzip 用的同一个算法）。它做两件事：一是找出图像里重复出现的像素模式（比如一整片纯白背景、一段重复的边框），用更短的"指针"替代；二是把出现频率高的颜色用更短的二进制编码表示，频率低的用更长的编码。
        </p>
        <p>
          整个过程没有丢任何信息。解码时，PNG 完全还原成原始像素，每个 R、G、B、A 通道的值都跟编码前一模一样。所以你可以把同一张 PNG 反复编辑、保存一万次，画质不会有任何劣化——这是它和 JPG 最本质的区别。
        </p>

        <h3>为什么 PNG 适合图标、截图、线条图</h3>
        <p>
          DEFLATE 对"重复模式"非常敏感。一张应用图标、一张 UI 截图、一张白底黑字的图表，里面通常有大片纯色区域和锐利的边缘——这些恰恰是 DEFLATE 最擅长压缩的内容。一张 1024×1024 的纯色背景 PNG 可能只有几 KB，因为整张图就是"一个像素重复一百万次"。
        </p>
        <p>
          另外 PNG 支持 8 位 Alpha 通道（256 级透明度），可以实现完美的半透明边缘。这在做 UI 切图、产品白底图、Logo 等场景里几乎是刚需。JPG 不支持透明，WebP 和 AVIF 虽然支持但兼容性不如 PNG 稳。
        </p>

        <h3>PNG 的局限：为什么照片不该用 PNG</h3>
        <p>
          照片的像素几乎不重复——天空里每一个像素的蓝色都微妙地不同，皮肤上每一处都有细微色差。DEFLATE 在这种"没有重复模式"的数据上几乎压不动。结果就是一张 3000×2000 的照片，PNG 可能 10 MB，JPG 80% 质量只要 600 KB，画质你眼睛都分不出来。
        </p>
        <p>
          所以记住一条：<strong>照片永远不要用 PNG</strong>。除非你是平面设计师在做高保真留档，且明确知道为什么需要无损。
        </p>

        <h2>JPG 是怎么工作的（有损压缩的开山）</h2>
        <p>
          JPG（也叫 JPEG）诞生于 1992 年，由 Joint Photographic Experts Group 制定。它是为照片而生的，整套设计都围绕"人眼怎么感知图像"这个核心展开。
        </p>

        <h3>离散余弦变换（DCT）简介</h3>
        <p>
          JPG 压缩的核心步骤是<strong>离散余弦变换</strong>（DCT）。它把图像切成 8×8 的小方块，每个方块用一组数学函数（不同频率的余弦波）来表示——低频代表大色块的平均颜色，高频代表细节和边缘。
        </p>
        <p>
          关键来了：人眼对低频信息（整体颜色、明暗）非常敏感，对高频信息（细微的纹理变化）相对迟钝。JPG 利用这一点，在压缩时大刀阔斧地砍掉高频系数（这一步叫"量化"，由"质量参数"控制），但保留低频。结果就是体积大幅缩小，肉眼看起来差别很小。
        </p>
        <p>
          这就是为什么 JPG 在质量 80% 时看起来跟原图几乎一样，质量 30% 时会出现明显的"马赛克"和"色带"——后者是因为量化太狠，连相对低的频率系数也被砍掉了。
        </p>

        <h3>为什么 JPG 适合照片</h3>
        <p>
          照片的特点是颜色连续、过渡平滑、细节复杂。这种数据用 DCT 表示效率非常高——大部分像素的颜色变化都集中在低频段，高频系数本来就很小，砍掉对画质影响也小。
        </p>
        <p>
          反过来想，PNG 的 DEFLATE 在照片上压不动，本质上是因为它"看不见"频率信息，只看像素是否重复。所以JPG 和 PNG 不是哪个更好的关系，而是两种完全不同的思路，各自适配不同的图像内容。
        </p>

        <h3>JPG 的局限：不支持透明、重复保存会画质损失</h3>
        <p>
          JPG 最大的两个缺点：
        </p>
        <ul>
          <li><strong>不支持透明</strong>。需要透明背景时，JPG 完全不能用，必须切换到 PNG 或 WebP。</li>
          <li><strong>"代际损失"</strong>。每一次重新保存为 JPG，都会再走一次量化过程，再丢一次细节。如果你在 Photoshop 里反复打开同一张 JPG、改一下、再保存，几次之后画质会肉眼可见地崩坏。这就是为什么<strong>所有原始素材都应该保留无损副本</strong>（PNG、TIFF 或 RAW），需要分发时再从原图压一份 JPG 出去。</li>
        </ul>
        <p>
          另外 JPG 对锐利边缘的压缩效果很差——边缘附近会出现 "ringing"（振铃伪影）和色块。所以截图、线条图、文字图绝对不该用 JPG。
        </p>

        <p>
          下面是一张 600×600 局部裁切的真实对比：左边是 JPG 质量 90，右边硬压到质量 15。注意右图边缘和过渡区域的色块、马赛克——这就是 DCT 量化太狠时的产物。
        </p>

        <div className="format-demo-grid format-demo-grid-2">
          <figure className="format-demo-card">
            <img src="/img/demo/crop-q90.jpg" alt="局部裁切照片 JPG 质量 90 版本，画面干净" loading="lazy" onClick={() => openPreview('/img/demo/crop-q90.jpg', 'JPG q90 · 58 KB · 几乎无伪影')} />
            <figcaption><strong>JPG q90</strong><span>58 KB · 几乎无伪影</span></figcaption>
          </figure>
          <figure className="format-demo-card">
            <img src="/img/demo/crop-q15.jpg" alt="局部裁切照片 JPG 质量 15 版本，画面出现明显马赛克和色块" loading="lazy" onClick={() => openPreview('/img/demo/crop-q15.jpg', 'JPG q15 · 6 KB · 马赛克 / 色块明显')} />
            <figcaption><strong>JPG q15</strong><span>6 KB · 马赛克 / 色块明显</span></figcaption>
          </figure>
        </div>

        <h2>WebP 为什么能比 PNG 和 JPG 都小</h2>
        <p>
          WebP 是 Google 在 2010 年推出的图片格式，源自 Google 收购的 On2 公司开发的 VP8 视频编码。它的设计目标只有一个：在 Web 上替代 JPG 和 PNG，让网页加载更快。
        </p>

        <h3>WebP 的双模式：无损 + 有损</h3>
        <p>
          WebP 同时支持两套压缩模式：
        </p>
        <ul>
          <li><strong>有损 WebP</strong>：用 VP8 视频帧内编码，类似 JPG 但更先进，比 JPG 同等画质小 25%–35%。</li>
          <li><strong>无损 WebP</strong>：用专门设计的预测编码，比 PNG 小 26% 左右（Google 官方数据）。</li>
        </ul>
        <p>
          两种模式都支持透明通道。这意味着 WebP 一个格式可以同时覆盖 PNG 和 JPG 的所有场景——这是它的最大卖点。
        </p>

        <h3>比 PNG 小 26% 的秘密（VP8 编码）</h3>
        <p>
          WebP 的有损模式用了几项 JPG 当年没有的技术：
        </p>
        <ul>
          <li><strong>分块预测</strong>：编码下一个块时，参考已经编码完的相邻块，只存差值。差值通常很小，更容易压缩。</li>
          <li><strong>变长 DCT 块</strong>：JPG 固定 8×8，WebP 可以用 4×4 到 16×16 的多种块大小，根据图像内容自适应选择。</li>
          <li><strong>更优的熵编码</strong>：用算术编码替代 JPG 的霍夫曼编码，压缩率更高。</li>
        </ul>
        <p>
          这三项加起来，让同等画质下的 WebP 比 JPG 小 25%–35%。在一个图片占网页流量 50% 以上的时代，这是非常可观的带宽节省。
        </p>

        <h3>兼容性现状（2026）</h3>
        <p>
          根据 caniuse.com 2026 年 5 月的数据，WebP 在全球浏览器市场的覆盖率超过 <strong>97%</strong>。Chrome、Edge、Firefox、Safari（14+，2020 年 9 月起）、所有主流移动浏览器全部支持。剩下 3% 主要是 IE11 和一些极老版本的 Android 系统浏览器。
        </p>
        <p>
          在 2026 年的 Web 开发里，<strong>WebP 已经可以作为默认格式</strong>，配合 <code>&lt;picture&gt;</code> 标签提供 JPG/PNG fallback 处理那 3% 的边缘场景就够了。
        </p>

        <figure>
          <img src="/img/browser-compatibility.svg" alt="主流浏览器对 PNG、JPG、WebP、AVIF 的支持情况矩阵：PNG 和 JPG 全部支持，WebP 各浏览器 2018-2020 年起支持，AVIF Chrome/Edge/Firefox 已支持，Safari 16+ 部分支持" width="800" height="320" loading="lazy" />
          <figcaption>WebP 全平台普及已是既定事实，AVIF Safari 上的覆盖还在追赶。数据来源：caniuse.com（2026 年 5 月）。</figcaption>
        </figure>

        <h2>AVIF 是下一代标准吗</h2>
        <p>
          AVIF（AV1 Image File Format）是 2019 年由 Alliance for Open Media（成员包括 Google、Netflix、Apple、Microsoft、Mozilla 等）推出的。它把更新的 AV1 视频编码用到静态图像上，目标是压缩率再上一个台阶。
        </p>

        <h3>AV1 视频编码进化而来</h3>
        <p>
          AV1 是为了取代 H.264/H.265 设计的开源视频编码，主打高压缩率。AVIF 直接复用了 AV1 的帧内编码能力——用更大的块（最大 128×128）、更多的预测模式、更精细的量化策略。
        </p>
        <p>
          代价是<strong>编码时间</strong>。AVIF 的编码速度比 JPG 慢 20–50 倍，比 WebP 慢 5–10 倍。解码倒是不慢，浏览器显示一张 AVIF 比 JPG 只慢一点点。所以 AVIF 特别适合"一次编码、多次分发"的场景——比如 CDN 上的静态图、电商主图。
        </p>

        <h3>比 WebP 小 30-50%</h3>
        <p>
          Netflix 2020 年的对比实验显示，AVIF 在相同画质下比 JPG 小 50%、比 WebP 小 20%–30%。在低码率（特别压缩的场景）下，AVIF 的画质优势更明显——JPG 早就糊成马赛克的码率，AVIF 还能保持清晰的边缘和柔和的渐变。
        </p>

        <h3>兼容性的现实问题</h3>
        <p>
          AVIF 的兼容性还在追赶 WebP。2026 年 5 月的数据：Chrome 85+（2020 年）、Firefox 113+（2023 年）、Safari 16+（2022 年）已支持，全球覆盖率约 <strong>92%</strong>。
        </p>
        <p>
          剩下 8% 包括：旧版 Safari（iOS 15 及以下，还有相当一部分老 iPhone 用户没升级）、Edge Legacy、部分企业内网的老 Chrome。所以 2026 年 AVIF 的最佳用法是：<strong>作为优化项放在 <code>&lt;picture&gt;</code> 的第一个 source，让浏览器优先用 AVIF，不支持就 fallback 到 WebP，再不行就 JPG</strong>。
        </p>

        <h2>实战：不同场景该选哪个格式</h2>
        <p>
          理论讲完了，回到最实用的问题：每天遇到的不同场景，到底该选哪个格式？先看决策树，再看每个分支的具体建议。
        </p>

        <figure>
          <img src="/img/format-decision-tree.svg" alt="图片格式选择决策树：先问是否需要透明，再分图标和照片场景，最终给出 SVG / PNG / WebP / JPG / AVIF 推荐" width="800" height="480" loading="lazy" />
          <figcaption>三步决策法：透明 → 图标/照片 → 给出格式推荐。</figcaption>
        </figure>

        <h3>网站 logo / 图标 → SVG &gt; PNG</h3>
        <p>
          能用 SVG 优先用 SVG——矢量格式，任何分辨率都清晰，体积通常比 PNG 还小。SVG 不适合的场景（比如带复杂渐变、阴影、滤镜的设计），退回到 PNG。WebP 也能用，但小图标场景下体积差距很小，PNG 的兼容性更稳。
        </p>

        <h3>网站 banner 照片 → WebP（JPG fallback）</h3>
        <p>
          首页大图、文章封面、产品展示图——这些占带宽最多的位置，是 WebP 收益最大的地方。一张 1 MB 的 JPG banner 换成 WebP 大概 650 KB，节省 35% 流量。用 <code>&lt;picture&gt;</code> 包一层 JPG fallback，覆盖那 3% 的老浏览器。
        </p>

        <h3>用户头像 / 小尺寸照片 → WebP 或 JPG</h3>
        <p>
          头像通常 100×100 到 400×400，本来体积就不大，WebP 和 JPG 的差距可能只有几 KB。如果你的后端处理流水线已经是 JPG，没必要为这几 KB 加 WebP；如果是新项目，直接 WebP。
        </p>

        <h3>微信 / 社交分享 → JPG</h3>
        <p>
          微信、微博、抖音的分享场景里，<strong>JPG 是最稳的选择</strong>。原因不是浏览器不支持 WebP——而是这些平台经常做二次处理（压缩、转码、生成缩略图），它们的处理流水线对 JPG 优化最好，对 WebP 可能反而劣化更严重。社交分享的核心是"画质和稳定性"，用 JPG 不会出错。
        </p>

        <h3>高画质留档 → PNG 或原 RAW</h3>
        <p>
          如果是平面设计师交付的源文件、需要后期反复编辑的素材、要打印的成品图——必须用无损格式：照片用 PNG 或 TIFF，相机原图用 RAW，矢量设计用 SVG/AI/PSD。绝对不要把原始素材以 JPG 保存，"代际损失"是不可逆的。
        </p>

        <h2>怎么把现有图片转成 WebP / AVIF</h2>
        <p>
          说完该选哪个，再讲怎么转。市面上常见的几种方法：
        </p>
        <ul>
          <li><strong>命令行工具</strong>（cwebp、avifenc、ffmpeg）：批处理灵活、参数全，适合开发者集成进构建流水线。门槛是要学命令，对非技术用户不友好。</li>
          <li><strong>设计软件</strong>（Photoshop、Sketch、Figma）：从 2022 年起都原生支持 WebP/AVIF 导出。优点是和现有工作流无缝衔接，缺点是装设计软件本身门槛高，处理大批量图片效率一般。</li>
          <li><strong>在线工具</strong>：浏览器里直接转，最快上手。要注意两件事：图片会不会上传到服务器（隐私问题）、能不能批量处理。</li>
        </ul>
        <p>
          如果你想立刻试试，可以用我们做的 <Link to="/" className="text-primary hover:underline font-medium">picthin 在线图片压缩工具</Link>——支持 PNG、JPG、WebP、AVIF、GIF 五种格式互转，<strong>全程在你的浏览器里本地处理，图片一秒钟都不会离开你的设备</strong>，也支持一次拖多张批量压缩。完全免费、无需注册。
        </p>

        <h2>常见问题（FAQ）</h2>

        <h3>WebP 在微信里能正常显示吗？</h3>
        <p>
          能。微信内置浏览器从 2020 年起已经支持 WebP，朋友圈和公众号文章里的 WebP 都能正常显示。但用户长按"保存图片"时，部分老版本微信会自动转成 JPG，可能导致画质损失。如果分享场景需要让用户保存原图，建议直接用 JPG。
        </p>

        <h3>PNG 和 SVG 怎么选？</h3>
        <p>
          SVG 是矢量格式，无限放大不糊，适合图标、Logo、简单图形。PNG 是位图格式，适合截图、复杂插画、需要透明背景的实拍图。一句话：能用 SVG 就用 SVG，不能用 SVG 才用 PNG。
        </p>

        <h3>为什么我的 JPG 越压越糊？</h3>
        <p>
          JPG 是有损压缩，每次重新保存都会再丢一次细节，多次保存会叠加成肉眼可见的"马赛克"和色块。要避免：保留一份高质量原图，每次都从原图压缩，而不是从已压过的 JPG 继续压。
        </p>

        <h3>WebP 会取代 PNG 和 JPG 吗？</h3>
        <p>
          短期内不会。PNG 和 JPG 已经是事实标准，所有系统、所有软件都原生支持，迁移成本极高。WebP 会逐渐成为 Web 端的首选，但桌面和移动端的本地图片场景，PNG 和 JPG 还会长期存在。
        </p>

        <h3>苹果设备支持 WebP 吗？</h3>
        <p>
          支持。Safari 从 14（iOS 14 / macOS Big Sur，2020 年 9 月发布）开始原生支持 WebP。到 2026 年，几乎所有在用的 iPhone、iPad、Mac 都能正常显示 WebP，可以放心使用。
        </p>

        <h2>小结</h2>
        <p>
          图片格式没有"最好"的，只有"最匹配场景"的。记住三条原则就够了：<strong>图标和透明图用 PNG（或 SVG），照片用 JPG 或 WebP，Web 端尽量上 WebP 配 JPG fallback</strong>。AVIF 是未来，可以作为锦上添花的优化项。
        </p>
        <p>
          想立刻试试格式转换？<Link to="/" className="text-primary hover:underline font-medium">用 picthin 在线压缩工具</Link>，浏览器里本地处理，支持五种格式互转，免费无需注册。
        </p>
    </BlogPostShell>
  );
}
