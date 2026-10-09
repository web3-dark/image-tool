import { useI18n } from '../../i18n/useI18n.js';
import { Link } from '../../components/LocalizedLink.jsx';
import BlogPostShell from '../../components/blog/BlogPostShell';
import { getBlogPost } from '../../config/content';

const POST = getBlogPost('/blog/registration-photo-under-200kb');

export default function RegistrationPhotoUnder200kb() {
  const { t, language } = useI18n();
  return (
    <BlogPostShell post={POST}>
      <p className="lead">{t("报名页面提示“照片不能超过 200KB”时，先确认它接受的格式和像素尺寸，再压缩文件。体积达标只是其中一项；照片底色、裁剪比例和人物位置仍需符合该报名系统的要求。")}</p>
      <p><Link to="/compress-image-to-200kb">{t("打开 200KB 图片压缩工具")}</Link>{t("，可以直接使用预设目标。原图在浏览器本地处理，无需把报名照片发到服务器。")}</p>

      <h2>{t("先看清三个限制")}</h2>
      <ul>
        <li><strong>{t("文件体积：")}</strong>{t("KB、MB 表示文件占用空间。例如上限是 200KB，压缩结果必须不超过这个上限。")}</li>
        <li><strong>{t("像素尺寸：")}</strong>{t("宽和高的单位是 px。压缩可能缩小像素尺寸，下载后需要再次检查。")}</li>
        <li><strong>{t("文件格式：")}</strong>{t("JPG/JPEG、PNG、WebP 是不同格式。如果系统只接受 JPG，不能仅把 PNG 的扩展名改成 .jpg。")}</li>
      </ul>
      <p>{t("以你正在使用的报名页面说明为准。PicThin 不提供证件照裁剪、底色替换或报名资格审核。")}</p>

      <h2>{t("用 PicThin 压缩到 200KB 的步骤")}</h2>
      <ol>
        <li>{t("保留一份原图，打开")}<Link to="/compress-image-to-200kb">{t("200KB 工具页")}</Link>{t("，确认“目标文件大小”为 200。")}</li>
        <li>{t("根据报名要求选择输出格式。只接受 JPG/JPEG 时选 JPG；不要为了文件更小而选系统不支持的 WebP。")}</li>
        <li>{t("点击选择文件，等待处理结束，对照原图检查人物脸部和文字边缘。")}</li>
        <li>{t("点击“下载图片”。在系统中查看下载文件的大小、宽度和高度，再把这份新文件提交到报名页面。")}</li>
      </ol>
      <p>{t("若你改了目标输入框，记得点击“按当前设置重新压缩”。不要把上一次下载的旧文件当成这次结果。")}</p>

      <h2>{t("示例：用公开图片检查处理结果")}</h2>
      <p>{t("教程使用项目自带的风景图演示，不使用真实证件照。你可以下载示例文件，按同样的设置试一次；照片内容不同，结果体积和清晰度也会不同。")}</p>
      <p><a href="/img/demo/landscape.png" download>{t("下载风景示例原图（PNG）")}</a></p>
      <figure>
        <img src={language === 'en' ? "/img/guides/200kb-example.en.png" : "/img/guides/200kb-example.jpg"} alt={t("PicThin 实测：风景 PNG 原图 1.3MB，200KB 目标下输出 JPG 为 147.29KB")} width={language === 'en' ? 1486 : 1280} height={language === 'en' ? 732 : 720} loading="lazy" />
        <figcaption>{t("2026-10-01，本地 Chromium 浏览器实测：200KB 目标、JPG 输出，原图 1200×750，结果 1140×712、147.29KB。此例同时改变了格式与尺寸，不能当作所有报名照片的压缩比例。")}</figcaption>
      </figure>

      <h2>{t("压完仍然无法上传，怎么排查？")}</h2>
      <h3>{t("系统仍提示“文件过大”")}</h3>
      <p>{t("先确认选中的是下载后的文件。不同系统对 KB 的计算和显示舍入可能不同，可以把目标改成 190KB 再处理，留出余量。若平台的实际上限是 100KB，应改用")}<Link to="/compress-image-to-100kb">{t("100KB 工具")}</Link>{t("。")}</p>
      <h3>{t("提示尺寸或格式不符")}</h3>
      <p>{t("查看下载文件的真实格式和像素尺寸。PicThin 的指定大小工具会在必要时缩小图片，但不会按报名要求自动裁剪宽高比。如果尺寸不合格，应先准备符合尺寸要求的原图，再压缩。")}</p>
      <h3>{t("体积达标，但脸部或文字模糊")}</h3>
      <p>{t("回到原图重新处理，避免对已经模糊的文件反复压缩。优先使用构图合适、没有多余背景的照片；如果报名要求允许，也可以提高目标体积。以下载文件的实际可读性为准。")}</p>
      <p>{t("需要其他上限，可以使用")}<Link to="/compress-image-to-size">{t("自定义 KB/MB 压缩")}</Link>{t("。如果问题出在 WebP 格式，继续阅读")}<Link to="/blog/webp-upload-convert-jpg">{t("WebP 无法上传的转换方法")}</Link>{t("。")}</p>
    </BlogPostShell>
  );
}
