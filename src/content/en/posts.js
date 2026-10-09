// English articles are authored independently; locale routing supplies their /en URLs.
export const ENGLISH_POSTS = {
  'registration-photo-under-200kb': {
    title: 'Photo too large for a form? Get it under 200 KB',
    description: 'Make a photo fit a 200 KB upload limit, check its dimensions, and troubleshoot a form that still rejects it.',
    category: 'Upload fixes', readingTime: '3 min read',
    keywords: 'photo under 200 KB,photo too large,reduce photo file size,upload limit',
  },
  'compress-png-keep-transparency': {
    title: 'Make a PNG smaller without losing its transparent background',
    description: 'Compress a logo, screenshot, or cutout while keeping transparency. Learn which details to check and when to leave the original alone.',
    category: 'How-to guides', readingTime: '3 min read',
    keywords: 'compress PNG,transparent PNG,reduce PNG file size,color quantization',
  },
  'webp-upload-convert-jpg': {
    title: 'Website won’t accept your WebP? Convert it to JPG',
    description: 'Turn a WebP into a JPG that an upload form can use. Check file size, transparency, and image quality before sending it.',
    category: 'Upload fixes', readingTime: '3 min read',
    keywords: 'WebP to JPG,unsupported image format,convert WebP,image upload',
  },
  'jpg-compress-to-target-size': {
    title: 'How to get a JPG under a file size limit',
    description: 'Need a photo under 1 MB, 500 KB, or 200 KB? Set a size limit, compare the result, and keep the detail that matters.',
    category: 'How-to guides', readingTime: '3 min read',
    keywords: 'compress JPG,photo under 1 MB,photo under 500 KB,reduce JPG size',
  },
  'png-webp-jpg-comparison': {
    title: 'JPG, PNG, WebP, or AVIF: which should you use?',
    description: 'Pick an image format for photos, transparent graphics, and websites. Compare real examples and understand the tradeoffs without the jargon.',
    category: 'Image formats', readingTime: '5 min read',
    keywords: 'JPG vs PNG,WebP vs AVIF,image formats,lossy vs lossless,transparent images',
  },
};

export function getLocalizedPost(post, language) {
  const english = language === 'en' && ENGLISH_POSTS[post.slug];
  if (!english) return post;
  return {
    ...post, ...english,
    articleTitle: english.title,
    ogTitle: english.title,
    seoTitle: `${english.title} | PicThin`,
    dateModified: '2026-10-10',
  };
}
