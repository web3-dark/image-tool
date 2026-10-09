export const GENERIC_TARGET_SIZE_PAGE = {
  path: '/compress-image-to-size',
  targetKb: 500,
  shortTitle: '压缩到指定大小',
  title: '图片压缩到指定大小',
  seoTitle: '图片压缩到指定大小 - 压到 20KB、50KB、100KB、200KB 或 1MB - PicThin',
  description: '免费将 JPG、PNG、WebP、AVIF 图片压缩到指定 KB 或 MB。自动调整质量和尺寸，全程浏览器本地处理，不上传图片。',
  lead: '输入目标体积，自动把图片压缩到指定 KB 以内。工具会先优化画质，必要时再缩小尺寸；所有处理都在你的浏览器本地完成。',
  guidance: '目标体积越小，需要舍弃的画面细节越多。手机相机原图通常需要同时降低编码质量和像素尺寸。',
  useCases: [
    '20KB–50KB：小尺寸头像、缩略图和限制严格的表单',
    '100KB–200KB：报名照片、普通网页配图和资料上传',
    '500KB–1MB：邮件附件和希望保留较高分辨率的照片',
  ],
};

export const TARGET_SIZE_PAGE_CONFIGS = [
  {
    path: '/compress-image-to-20kb',
    targetKb: 20,
    shortTitle: '图片压缩到 20KB',
    title: '图片压缩到 20KB 以内',
    seoTitle: '图片压缩到 20KB 以内 - 在线压缩照片且不上传 - PicThin',
    description: '免费把 JPG、PNG、WebP、AVIF 图片压缩到 20KB 以内。自动降低画质和尺寸，浏览器本地处理，照片不上传服务器。',
    lead: '适合文件上限非常严格的小头像和在线表单。工具会尽量把图片控制在 20KB 以内，并明确提示无法兼顾清晰度的情况。',
    guidance: '20KB 是非常小的目标。大尺寸手机照片通常会明显缩小分辨率，建议下载后放大检查文字、证件边缘和人脸细节。',
    useCases: ['限制在 20KB 以内的小头像', '旧系统或内部表单的缩略图', '只用于屏幕预览的小尺寸照片'],
  },
  {
    path: '/compress-image-to-50kb',
    targetKb: 50,
    shortTitle: '图片压缩到 50KB',
    title: '图片压缩到 50KB 以内',
    seoTitle: '图片压缩到 50KB 以内 - 免费在线本地压缩 - PicThin',
    description: '免费把照片和图片压缩到 50KB 以内，支持 JPG、PNG、WebP、AVIF 输入。图片只在浏览器本地处理，不上传服务器。',
    lead: '把照片压缩到不超过 50KB，适合头像、报名材料和体积限制严格的上传页面。原图和结果都会留在当前设备。',
    guidance: '50KB 通常适合小尺寸展示。照片细节较多时，选择 JPG 输出往往比保持 PNG 更容易达到目标。',
    useCases: ['网站头像和账户照片', '报名或资料提交页面', '需要快速发送的小尺寸图片'],
  },
  {
    path: '/compress-image-to-100kb',
    targetKb: 100,
    shortTitle: '图片压缩到 100KB',
    title: '图片压缩到 100KB 以内',
    seoTitle: '图片压缩到 100KB 以内 - 照片本地压缩不上传 - PicThin',
    description: '免费将 JPG、PNG、WebP、AVIF 图片压缩到 100KB 以内。自动平衡清晰度与文件大小，全程本地处理、不上传。',
    lead: '将照片和截图压缩到 100KB 以内，适合常见报名表、头像和资料上传场景。无需注册，处理完成后直接下载。',
    guidance: '100KB 能兼顾多数小图的清晰度和上传速度。文字截图可以优先尝试 WebP，普通照片可选择 JPG。',
    useCases: ['报名照片和个人头像', '办公系统资料上传', '网页缩略图与邮件中的小图'],
  },
  {
    path: '/compress-image-to-200kb',
    dateModified: '2026-10-01',
    targetKb: 200,
    shortTitle: '图片压缩到 200KB',
    title: '图片压缩到 200KB 以内',
    seoTitle: '图片压缩到 200KB 以内 - 报名照片在线压缩 - PicThin',
    description: '报名照片超过 200KB？免费在浏览器本地压缩为 JPG 或 WebP，自动调整画质与尺寸。附文件大小、像素和格式检查步骤，照片不上传服务器。',
    lead: '在文件体积和画面细节之间取得更自然的平衡，适合资料上传、网页配图和日常分享。图片始终留在你的设备里。',
    guidance: '200KB 通常可以保留比 20KB、50KB 更高的分辨率。若原图已经很小，工具会直接保留原文件，避免重复损失画质。',
    useCases: ['表单、简历和资料图片', '网页文章配图', '聊天和邮件附件'],
    guide: {
      title: '报名照片超过 200KB，怎么处理？',
      steps: [
        '先记录报名页面要求的文件格式、像素尺寸和大小上限。200KB 只是文件体积，不代表照片尺寸合格。',
        '保持目标为 200KB；若报名系统只接受 JPG/JPEG，选择 JPG 输出，再选择原图开始处理。',
        '下载结果并检查文件属性、人物或文字细节。工具可能缩小像素尺寸，若低于报名要求，应重新准备符合尺寸的原图。',
      ],
      check: '如果下载结果仍被提示过大，可输入 190KB 再处理，为不同系统的 KB 计算方式留出余量。工具不负责裁剪、换底色或审核照片是否符合报名规定。',
      path: '/blog/registration-photo-under-200kb',
      label: '报名照片超过 200KB：压缩步骤与上传失败排查',
    },
  },
].map((page) => ({
  ...page,
  faq: [
    [`怎样把图片压缩到 ${page.targetKb}KB 以内？`, `选择图片后，PicThin 会自动调整编码质量；如果仍然超过 ${page.targetKb}KB，再逐步缩小像素尺寸，直到达到目标或触及清晰度下限。`],
    [`压到 ${page.targetKb}KB 会不会模糊？`, `是否明显取决于原图尺寸和内容。目标越小，细节损失越多。工具不会无限降低画质，无法合理达到时会提示提高目标值。`],
    ['图片会上传到服务器吗？', '不会。图片读取、压缩、预览和下载都在当前浏览器本地完成。'],
  ],
}));

export function getTargetSizePage(path) {
  const page = TARGET_SIZE_PAGE_CONFIGS.find((item) => item.path === path);
  if (!page) throw new Error(`Missing target-size page config for ${path}`);
  return page;
}
