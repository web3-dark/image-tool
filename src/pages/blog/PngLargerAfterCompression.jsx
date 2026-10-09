import BlogPostShell from '../../components/blog/BlogPostShell';
import { Link } from '../../components/LocalizedLink.jsx';
import { getBlogPost } from '../../config/content';

const POST = getBlogPost('/blog/png-larger-after-compression');
export default function PngLargerAfterCompression() {
  return <BlogPostShell post={POST}>
    <p className="lead">图片重新保存后变大，不一定是工具出了问题。先看原图和结果的格式是否相同，再看像素尺寸、透明背景和画面内容。文件更大，也不代表画面更清晰。</p>
    <h2>先判断是哪一种情况</h2>
    <ul>
      <li><strong>JPG 转成了 PNG：</strong>JPG 已丢弃一部分细节来减小文件；PNG 会无损保存解码后的像素，通常需要更多空间。转成 PNG 不会找回 JPG 已经丢失的细节。</li>
      <li><strong>PNG 重新保存后变大：</strong>原图可能已经使用索引颜色或专门优化过。换一种编码方式，不一定比原来的文件更小。</li>
      <li><strong>体积几乎没变：</strong>简单图标和已经压过的图片，剩余压缩空间可能很小。显示“节省 0%”不等于处理失败。</li>
    </ul>
    <h2>同一幅风景，不同文件大小</h2>
    <p>下面是网站已有的公开样例，可下载后自行比较。两张图片都是 1200 × 750 像素；PNG 为 1,366,770 字节，JPG 为 114,220 字节。它们使用不同的编码设置，这个例子说明格式会影响体积，不代表所有照片都有相同的压缩比例。</p>
    <figure><img src="/img/demo/landscape-q80.jpg" width="1200" height="750" loading="lazy" alt="用于比较 PNG 和 JPG 文件体积的风景样例" /><figcaption><a href="/img/demo/landscape.png" download>下载 PNG（约 1.30 MB）</a> · <a href="/img/demo/landscape-q80.jpg" download>下载 JPG（约 111.54 KB）</a></figcaption></figure>
    <h2>按照用途处理</h2>
    <ol>
      <li>普通照片不需要透明背景：保留 JPG，或在接收方支持时尝试 WebP。用<Link to="/">本地图片压缩工具</Link>比较实际效果。</li>
      <li>Logo、透明素材和需要清晰文字的截图：使用<Link to="/compress-png">PNG 压缩</Link>，检查细线、渐变和透明边缘。</li>
      <li>网页允许 WebP：尝试<Link to="/png-to-webp">PNG 转 WebP</Link>，确认体积和画质都符合用途。</li>
      <li>表单要求特定 KB：使用<Link to="/compress-image-to-size">指定大小工具</Link>；它输出 JPG 或 WebP，不适合必须交付 PNG 的要求。</li>
    </ol>
    <h2>PicThin 的 PNG“质量”具体改变什么？</h2>
    <p>低于 100% 时，PNG 工具减少颜色数量再编码；降低数值可能让渐变出现色带。100% 时不做颜色量化，但也不保证文件更小。PNG 工具页在结果不小于原图时保留原文件。</p>
    <p>不要为了更小的数字反复压同一张结果图。每次都从原图开始，按实际使用尺寸查看，再放大检查文字和边缘。完整步骤见<Link to="/blog/compress-png-keep-transparency">保留透明背景的 PNG 压缩指南</Link>。</p>
    <h2>什么时候应该保留原文件？</h2>
    <p>如果交付要求像素完全不变，或压小后关键文字已经不清楚，请保留原图。原图已经足够小时，继续压缩没有必要；适合用途比追求最大的压缩比例更重要。</p>
    <p>格式原理参考 <a href="https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types">MDN 图片格式指南</a>。</p>
  </BlogPostShell>;
}
