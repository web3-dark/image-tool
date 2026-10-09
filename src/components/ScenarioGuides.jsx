import { Link } from './LocalizedLink.jsx';
import { useI18n } from '../i18n/useI18n.js';

const SCENARIOS = [
  { path: '/blog/registration-photo-under-200kb', zh: '考试、入学报名照片超限', en: 'A photo is too large for an application' },
  { path: '/blog/job-application-image-upload', zh: '求职照片、证书附件上传失败', en: 'A job portal rejects an image attachment' },
  { path: '/blog/compress-id-document-images', zh: '证件、护照扫描图片本地压缩', en: 'An ID or document scan needs a smaller file' },
  { path: '/blog/compress-png-keep-transparency', zh: '商品素材、Logo 保留透明背景', en: 'A product cutout or logo needs transparency' },
  { path: '/blog/png-webp-jpg-comparison', zh: '设计与网页素材的格式选择', en: 'Choosing formats for design and web assets' },
  { path: '/remove-image-metadata', zh: '公开分享照片前清除 EXIF / GPS', en: 'Removing photo metadata before sharing' },
];

export default function ScenarioGuides() {
  const { language } = useI18n();
  const english = language === 'en';
  return <section className="mt-10 rounded-xl border border-border bg-surface-muted p-5 md:p-6">
    <h2 className="text-xl font-semibold text-foreground">{english ? 'Find help for your task' : '按使用场景查找方法'}</h2>
    <p className="text-sm text-foreground-muted mt-2 leading-6">{english ? 'Start with what you need to submit or share, then check the format, file size, and image detail.' : '从你要提交或分享的图片出发，先确认格式、大小和清晰度，再选择处理方法。'}</p>
    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 mt-4">
      {SCENARIOS.map((item) => <li key={item.path}><Link to={item.path} className="text-primary hover:underline text-sm leading-6">{english ? item.en : item.zh}</Link></li>)}
    </ul>
  </section>;
}
