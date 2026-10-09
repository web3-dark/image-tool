import { useI18n } from '../../i18n/useI18n.js';
import { Link } from 'react-router-dom';
import BlogPostShell from '../../components/blog/BlogPostShell';
import { getBlogPost } from '../../config/content';

const POST = getBlogPost('/blog/compress-png-keep-transparency');

export default function CompressPngKeepTransparency() {
  const { t, language } = useI18n();
  return (
    <BlogPostShell post={POST}>
      <p className="lead">{t("透明 Logo、图标和商品素材要压小，先保持 PNG 输出，再检查透明边缘和颜色变化。改成 JPG 会丢失透明背景；保留 PNG 格式，也不代表压缩前后每个像素都完全一样。")}</p>
      <p><Link to="/compress-png">{t("打开保留透明背景的 PNG 压缩工具")}</Link>{t("，从默认质量开始比较结果。")}</p>

      <h2>{t("为什么有些 PNG 特别大？")}</h2>
      <p>{t("尺寸越大、颜色和细节越复杂，需要保存的数据通常越多。照片、阴影和柔和渐变包含大量颜色，往往比纯色图标更难压小。PNG 文件本身采用无损编码，但工具可以先减少颜色，再编码为 PNG；减少颜色这一步会改变画面。")}</p>
      <p>{t("PicThin 的 PNG 工具在质量低于 100% 时使用颜色量化；质量控制保留的颜色数量，不是“保证减少同样百分比的文件大小”。100% 时不做颜色量化，也不保证文件一定变小。")}</p>

      <h2>{t("按这四步处理透明 PNG")}</h2>
      <ol>
        <li>{t("保留原图，打开")}<Link to="/compress-png">{t("PNG 压缩页")}</Link>{t("，使用默认 82% 输出质量。")}</li>
        <li>{t("选择 PNG 文件，等待原图和结果出现，比较两者体积。")}</li>
        <li>{t("若需要继续压小，降低质量，然后点击“压缩 PNG”。检查小字、细线、阴影和渐变，出现色带时提高质量重试。")}</li>
        <li>{t("下载 PNG，在浅色和深色背景上分别查看边缘。预览区的底色不等于图片自身的背景色。")}</li>
      </ol>

      <h2>{t("用一张示例图复现")}</h2>
      <p>{t("可以先用项目的公开风景 PNG 观察颜色量化对照片细节的影响，再用自己的透明素材检查边缘。风景样例没有透明区域，不能用它证明透明背景的效果。")}</p>
      <p><a href="/img/demo/landscape.png" download>{t("下载风景示例 PNG")}</a></p>
      <figure>
        <img src={language === 'en' ? "/img/guides/png-example.en.png" : "/img/guides/png-example.jpg"} alt={t("PNG 压缩实测：82% 质量下从 1.3MB 减至 462.53KB，预览对照风景细节")} width={language === 'en' ? 1486 : 1280} height={language === 'en' ? 732 : 720} loading="lazy" />
        <figcaption>{t("2026-10-01，本地 Chromium 浏览器实测：默认 82% 质量，1200×750 风景 PNG 从 1.3MB 减至 462.53KB，输出仍为 1200×750。此例展示颜色量化效果，不是透明背景验证图。")}</figcaption>
      </figure>

      <h2>{t("下载前检查哪些地方？")}</h2>
      <ul>
        <li><strong>{t("透明边缘：")}</strong>{t("把结果放在不同底色上，查看是否有不自然的轮廓或色边。")}</li>
        <li><strong>{t("文字与细线：")}</strong>{t("按实际展示尺寸和放大视图分别检查，尤其是小号文字。")}</li>
        <li><strong>{t("渐变与阴影：")}</strong>{t("观察连续颜色有没有变成一圈圈明显的色带。")}</li>
      </ul>

      <h2>{t("为什么结果没有变小？")}</h2>
      <p>{t("原图可能已经使用了很少的颜色或经过优化。这个工具在处理结果不小于原图时会保留原文件，因此显示“节省 0%”不一定是故障。继续降低质量是否值得，要看画面能否接受。")}</p>
      <p>{t("如果图片只用于网页，且使用方接受 WebP，可以尝试")}<Link to="/png-to-webp">{t("PNG 转 WebP")}</Link>{t("。若交付规范明确要求 PNG 或像素完全不变，请保留原文件，并确认是否允许调整尺寸或颜色。")}</p>

      <h2>{t("能同时保证透明、完全无损和指定 KB 吗？")}</h2>
      <p>{t("不能对所有图片作出这个保证。指定大小工具目前输出 JPG 或 WebP，不输出 PNG；JPG 不保留透明背景。如果必须交付透明 PNG，应优先满足格式和视觉要求，再与接收方确认体积上限。")}</p>
      <p>{t("更多选择方法见")}<Link to="/blog/png-webp-jpg-comparison">{t("PNG、JPG、WebP、AVIF 格式对比")}</Link>{t("。")}</p>
    </BlogPostShell>
  );
}
