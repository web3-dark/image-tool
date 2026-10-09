import BlogPostShell from '../../components/blog/BlogPostShell';
import { Link } from '../../components/LocalizedLink.jsx';
import { getBlogPost } from '../../config/content';

const POST = getBlogPost('/blog/compress-without-losing-quality');
export default function CompressWithoutLosingQuality() {
  return <BlogPostShell post={POST}>
    <p className="lead">“看起来一样清楚”和“每个像素完全不变”是两种要求。先确定图片用在什么地方，再选择压缩方式；没有一个质量数值能让所有图片都小而清楚。</p>
    <h2>先分清三件事</h2>
    <ul>
      <li><strong>文件体积：</strong>KB、MB 决定上传和传输需要多少数据。</li>
      <li><strong>像素尺寸：</strong>宽 × 高决定图片有多少像素；减小尺寸会减少可展示的细节。</li>
      <li><strong>编码质量：</strong>JPG 等有损格式会舍弃部分信息；相同的质量数字在不同格式和编码器里不能直接比较。</li>
    </ul>
    <h2>用公开样例观察细节</h2>
    <p>下面是同一场景的两个已有 JPG 局部样例。看草地纹理和轮廓边缘：文件小很多时，细节也可能变少。这些是预先制作的对照文件，不是对你的图片效果的承诺。</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-6">
      <figure className="!m-0"><a href="/img/demo/crop-q90.jpg"><img src="/img/demo/crop-q90.jpg" width="600" height="600" loading="lazy" alt="较高质量 JPG 样例，观察草地纹理和边缘" /></a><figcaption>较高质量样例：57.85 KB，可点击原图查看。</figcaption></figure>
      <figure className="!m-0"><a href="/img/demo/crop-q15.jpg"><img src="/img/demo/crop-q15.jpg" width="600" height="600" loading="lazy" alt="较低质量 JPG 样例，对比纹理和边缘细节" /></a><figcaption>较低质量样例：6.33 KB，可点击原图查看。</figcaption></figure>
    </div>
    <h2>照片：从原图生成不同副本</h2>
    <ol>
      <li>保留原图，打开<Link to="/compress-jpg">JPG 压缩</Link>，从默认 80% 开始。</li>
      <li>先在最终展示尺寸下检查，再放大查看人脸、文字和高反差边缘。</li>
      <li>如果出现明显色块或模糊，提高质量重新生成；如果仍偏大而画质可以接受，再小幅降低质量。</li>
      <li>下载后检查文件尺寸和体积，不要只看网页里的“节省比例”。</li>
    </ol>
    <h2>截图和透明图：不要只追求最小体积</h2>
    <p>小字、线条和透明边缘对压缩更敏感。PNG 本身使用无损编码，但 PicThin 在质量低于 100% 时会先减少颜色，这一步会改变像素。必须逐像素一致时，请保留原始文件，不要把“输出 PNG”当作完全无损的保证。</p>
    <h2>有严格上传上限怎么办？</h2>
    <p><Link to="/compress-image-to-size">指定大小工具</Link>会先调整质量，必要时减小像素尺寸。达到 KB 上限并不代表满足证件照的尺寸或清晰度要求。如果细节已经无法接受，就应换一张更合适的原图，或确认接收方是否允许更大的文件。</p>
    <p>文字已模糊的图片，转成 PNG 或提高质量数值也不能恢复丢失的信息。尽量索取原始照片或截图，再重新处理。</p>
    <h2>下载前的三项检查</h2>
    <ul><li>关键文字、人脸和边缘是否清楚？</li><li>宽高、文件格式是否符合使用方要求？</li><li>是否保留了原图，方便以后重新导出？</li></ul>
    <p>进一步了解<Link to="/blog/png-webp-jpg-comparison">图片格式的选择</Link>；技术参考 <a href="https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Image_types">MDN 格式指南</a>。</p>
  </BlogPostShell>;
}
