import { useI18n } from '../../i18n/useI18n.js';
import { Link } from '../../components/LocalizedLink.jsx';
import BlogPostShell from '../../components/blog/BlogPostShell';
import { getBlogPost } from '../../config/content';

const POST = getBlogPost('/blog/webp-upload-convert-jpg');

export default function WebpUploadConvertJpg() {
  const { t, language } = useI18n();
  return (
    <BlogPostShell post={POST}>
      <p className="lead">{t("下载的 WebP 图片在浏览器里能打开，表单却提示“格式不支持”，可能是接收方只接受 JPG 或 PNG。先看格式要求，再真正转换文件；把 .webp 改成 .jpg 并不会改变文件内容。")}</p>
      <p>{t("如果接收方接受 JPG，可以使用")}<Link to="/webp-to-jpg">{t("WebP 转 JPG 工具")}</Link>{t("。原图在当前浏览器中转换，无需注册或上传到服务器。")}</p>

      <h2>{t("正确转换的步骤")}</h2>
      <ol>
        <li>{t("保留原 WebP 文件，打开转换工具，选择一张静态 WebP 图片。")}</li>
        <li>{t("先使用默认 88% 输出质量，等待处理完成，比较预览和结果体积。")}</li>
        <li>{t("需要调整时，移动质量滑杆后点击“转换为 JPG”。质量降低可能减小体积，也可能损失细节。")}</li>
        <li>{t("点击“下载 JPG”，再回到上传页面选择这个新文件，而不是原来的 WebP。")}</li>
      </ol>
      <p>{t("JPG 和 JPEG 通常指同一种图片格式。若接收方对扩展名有额外限制，请以它的提示为准。")}</p>

      <h2>{t("示例：转换项目自带的 WebP 图片")}</h2>
      <p>{t("这张公开风景图可用于复现流程。转换后应检查照片纹理和文件大小；输出为 JPG 后，文件不一定比 WebP 小。")}</p>
      <p><a href="/img/demo/landscape-q75.webp" download>{t("下载风景示例 WebP")}</a></p>
      <figure>
        <img src={language === 'en' ? "/img/guides/webp-jpg-example.en.png" : "/img/guides/webp-jpg-example.jpg"} alt={t("WebP 转 JPG 实测：原图 93.58KB，默认质量转换后为 80.42KB")} width={language === 'en' ? 1486 : 1280} height={language === 'en' ? 732 : 720} loading="lazy" />
        <figcaption>{t("2026-10-01，本地 Chromium 浏览器实测：默认 88% 质量，示例 WebP 为 93.58KB，JPG 结果为 80.42KB。这个样例变小了，但其他图片可能变大，应逐张检查结果。")}</figcaption>
      </figure>

      <h2>{t("三个容易忽略的问题")}</h2>
      <h3>{t("透明背景会消失")}</h3>
      <p>{t("JPG 不支持透明区域。透明 Logo 和贴纸转换后会出现不透明底色，具体底色需要检查实际结果。如果素材需要叠加在其他背景上，保留原 WebP，或准备接收方支持的透明 PNG。")}</p>
      <h3>{t("转换后文件反而更大")}</h3>
      <p>{t("转换的目的首先是让接收方能识别格式，不是保证压缩。WebP 和 JPG 的编码方式不同，相同画面转成 JPG 后可能增加体积。若上传还有限制，可以继续使用")}<Link to="/compress-image-to-size">{t("指定大小工具")}</Link>{t("，直接把原 WebP 转成满足目标体积的 JPG，避免反复处理已经压缩过的 JPG。")}</p>
      <h3>{t("动画无法保留")}</h3>
      <p>{t("JPG 只能保存静态画面。此工具不用于保留动态 WebP 的动画；如果必须保留动画，应选择接收方支持的动画格式和专门工具。")}</p>

      <h2>{t("转换成 JPG 后仍然上传失败？")}</h2>
      <ul>
        <li>{t("确认选中的是新下载的 JPG，并在本机重新打开，检查文件是否完整。")}</li>
        <li>{t("核对文件体积，以及宽度、高度或宽高比要求。格式正确并不表示其他限制也合格。")}</li>
        <li>{t("若报错明确是网络或登录状态问题，先处理对应问题，无需继续压缩图片。")}</li>
      </ul>
      <p>{t("遇到 200KB 上限，可以阅读")}<Link to="/blog/registration-photo-under-200kb">{t("照片压缩与上传失败排查")}</Link>{t("；需要保留透明素材，可以阅读")}<Link to="/blog/compress-png-keep-transparency">{t("PNG 透明背景压缩指南")}</Link>{t("。")}</p>
    </BlogPostShell>
  );
}
