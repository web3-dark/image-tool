import BlogPostShell from '../../components/blog/BlogPostShell';
import { Link } from '../../components/LocalizedLink.jsx';
import { getBlogPost } from '../../config/content';

const POST = getBlogPost('/blog/job-application-image-upload');

export default function JobApplicationImageUpload() {
  return <BlogPostShell post={POST}>
    <p className="lead">招聘网站提示“附件太大”，先确认被拒绝的是头像、证书图片，还是 PDF / Word 简历。PicThin 可以在浏览器本地压缩图片，原图和结果不会上传到 PicThin 服务器；它不处理 PDF、Word，也不能修复招聘系统的登录或网络故障。</p>
    <p>如果页面明确要求 JPG 或 PNG，并给出了 KB / MB 上限，可以直接使用<Link to="/compress-image-to-size">图片压缩到指定大小</Link>。如果文件本来就是 PDF 或 DOCX，请保留原格式，使用对应的文档处理方式，不要为了压缩而把整份简历截图成图片。</p>
    <h2>先确认上传的是哪一种材料</h2>
    <ul>
      <li><strong>个人头像：</strong>除了大小，还要看像素、比例和背景要求。照片压小不会自动满足这些条件。</li>
      <li><strong>证书或作品图片：</strong>先确认系统接受图片，再检查名称、日期和作品细节能否看清。</li>
      <li><strong>文字简历：</strong>PDF / Word 与图片是不同类型。把文字变成截图会失去原文档可选择的文本，也可能不符合系统要求。</li>
      <li><strong>多份附件：</strong>区分“每个文件上限”和“所有附件合计上限”。单张图片达标不代表整组附件达标。</li>
    </ul>
    <h2>把求职图片压到招聘页面允许的大小</h2>
    <ol>
      <li>保留原文件，记下招聘页面接受的格式、单文件大小，以及是否有最低像素要求。没有统一适用于所有招聘网站的数值。</li>
      <li>打开<Link to="/compress-image-to-size">指定大小工具</Link>，按页面要求输入上限。例如页面要求不超过 500KB，就以 500KB 为目标；这只是操作示例。</li>
      <li>选择系统支持的输出格式。该工具提供 JPG 和 WebP；如果必须交 PNG，使用<Link to="/compress-png">PNG 压缩</Link>，手动检查结果是否达标。</li>
      <li>选择原图，等待结果，放大检查人脸、文字和作品细节。指定大小工具必要时会缩小像素尺寸。</li>
      <li>下载新文件，确认其格式、大小和宽高，再回到招聘网站上传这份副本。修改目标后，需要重新压缩并重新下载。</li>
    </ol>
    <h2>附件变小了，为什么仍然上传失败？</h2>
    <h3>“文件过大”</h3>
    <p>先检查文件名和修改时间，避免再次选择原图。若结果紧贴上限，可在允许的清晰度范围内略降目标，为 KB 的计算和显示舍入留出余量。还要检查是否存在多附件合计限制。</p>
    <h3>“格式不支持”</h3>
    <p>检查实际格式，不要只改后缀。如果原图是 WebP，而系统要求 JPG，按<Link to="/blog/webp-upload-convert-jpg">WebP 转 JPG 教程</Link>生成新文件。系统要求 PDF 时，压缩 JPG 并不能解决问题。</p>
    <h3>“尺寸不符”，或文字已经模糊</h3>
    <p>回到原图处理。文件体积和像素尺寸是两件事：更小的 KB 数可能伴随分辨率下降。若清晰度和最低尺寸无法同时满足，不要反复压缩同一副本；应重新准备原始材料，或查看招聘网站提供的其他提交方式。</p>
    <h3>没有文件错误，但提交一直失败</h3>
    <p>检查必填项目是否遗漏、登录是否过期，以及招聘页面的错误提示。文件压缩无法解决账号权限或服务异常；联系平台时描述错误即可，不必在公开评论区附上私人证件和简历。</p>
    <h2>提交前检查隐私和可读性</h2>
    <p>处理后的图片仍可能包含姓名、联系方式或证书号码。本地压缩不会自动遮挡这些内容。只向你确认过的招聘入口提交所需材料；想了解处理过程，可以阅读<Link to="/blog/compress-images-without-uploading">如何验证图片没有上传</Link>。</p>
    <p>证件或扫描材料需要特别注意文字细节，见<Link to="/blog/compress-id-document-images">证件扫描图片压缩指南</Link>；如果是报名用人像，见<Link to="/blog/registration-photo-under-200kb">报名照片格式、尺寸和体积检查</Link>。</p>
  </BlogPostShell>;
}
