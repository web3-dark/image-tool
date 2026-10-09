import BlogPostShell from '../../components/blog/BlogPostShell';
import { Link } from '../../components/LocalizedLink.jsx';
import { getBlogPost } from '../../config/content';

const POST = getBlogPost('/blog/compress-images-without-uploading');

export default function CompressImagesWithoutUploading() {
  return <BlogPostShell post={POST}>
    <p className="lead">网页工具不一定要把图片上传到服务器才能工作。PicThin 在浏览器中读取和处理你选择的图片，再生成可以下载的新文件。原图和结果图不会发送到 PicThin 服务器。你也可以先用公开样例检查这个过程，再决定是否使用自己的照片。</p>
    <h2>“本地处理”和“完全没有网络请求”有什么区别？</h2>
    <p>第一次打开网站时，浏览器需要下载页面、样式和程序。选择图片后，还可能下载压缩所需的代码。这些是程序传入你的设备，不是图片传出设备。PicThin 的压缩后台线程代码也由本站提供。</p>
    <p>网站会使用访问统计和匿名工具事件了解使用情况。工具事件包含操作类型、工具、输出格式、数量、耗时和错误类别，不包含图片内容、文件名或图片预览。你主动提交意见反馈时，留言、可选邮箱和当前页面会发送到服务器；它与图片压缩是不同的操作。</p>
    <h2>用公开样例检查网络请求</h2>
    <ol>
      <li>先<a href="/img/demo/landscape.png" download>下载风景 PNG 样例</a>，然后打开<Link to="/">图片压缩工具</Link>，保持 JPG 输出。</li>
      <li>在电脑 Chrome 或 Edge 中打开开发者工具，选择 Network（网络）。确认正在记录请求，选择 All（全部），清空已有记录。</li>
      <li>选择样例图片，等待处理完成，然后下载结果。查看这个过程中出现的请求及其目标地址、类型和发起原因。</li>
      <li>对 POST 等携带数据的请求，检查 Payload（载荷）。例如 <code>/api/tool-events</code> 是匿名操作统计，应该只有少量事件字段，没有文件、图片字节或图片的 Base64 内容。</li>
      <li>不要仅凭“没看到文件名”就下结论，也不要只检查一个请求。查看完整记录；浏览器扩展可能产生额外请求，可在禁用扩展的独立测试窗口中复查。</li>
    </ol>
    <p>浏览器预览使用的 <code>blob:</code> 地址是本地对象引用，地址本身不代表图片已经上传。反过来，仅看到这种地址也不能证明一个网站没有在别处传输图片。</p>
    <h2>再做一次断网测试</h2>
    <ol>
      <li>联网完成一次所需格式的压缩，让相关程序加载完毕，并下载结果。</li>
      <li>保持页面打开，断开网络，或在开发者工具 Network 中选择 Offline（离线）。</li>
      <li>重新选择样例并调整质量，确认能够生成、预览和下载新的结果。</li>
      <li>测试结束后恢复网络设置。如果第一次使用某种格式时离线失败，先联网加载它需要的程序，再重试。</li>
    </ol>
    <p>断网测试能说明这次处理不依赖服务器计算，但它本身不是完整的隐私审计，也不能单独排除某个网站恢复联网后发送数据的可能。将它和网络请求检查结合起来，比只看一句隐私承诺更有用。</p>
    <h2>本地压缩不等于照片已适合公开分享</h2>
    <p>图片中的姓名、人脸、证件号码或聊天内容仍然可能清晰可见。压缩不会自动遮挡它们。原文件也可能包含拍摄位置等元数据；如果下一步要公开分享，可以使用<Link to="/remove-image-metadata">清除 EXIF / GPS 工具</Link>生成新副本，并检查下载结果。不要把普通压缩当作元数据清理：某些工具在原图已经足够小时会直接保留原文件。</p>
    <p>本地处理也不能保护已被恶意扩展或软件控制的设备。请保留原图，确认下载副本的清晰度和内容，使用完毕后清理不再需要的文件。</p>
    <h2>按你的任务选择工具</h2>
    <ul>
      <li>普通照片：<Link to="/compress-jpg">本地 JPG 压缩</Link>。</li>
      <li>有透明背景的素材：<Link to="/compress-png">PNG 压缩</Link>，检查边缘和颜色。</li>
      <li>表单有大小限制：<Link to="/compress-image-to-size">压缩到指定 KB</Link>，同时确认表单要求的像素尺寸和格式。</li>
    </ul>
    <p>网络面板的具体操作可参考 <a href="https://developer.chrome.com/docs/devtools/network">Chrome 官方网络检查文档</a>。有关 PicThin 的处理方式，见<Link to="/about">关于 PicThin</Link>和页面底部的隐私说明。</p>
  </BlogPostShell>;
}
