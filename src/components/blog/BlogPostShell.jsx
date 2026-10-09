import { BLOG_POSTS } from '../../config/content.js';
import EnglishArticle from '../../content/en/Articles.jsx';
import { ENGLISH_POSTS, getLocalizedPost } from '../../content/en/posts.js';
import { useI18n } from '../../i18n/useI18n.js';
import { Link } from '../LocalizedLink.jsx';
import BlogLayout from '../BlogLayout';
import BlogBreadcrumbs from './BlogBreadcrumbs';
import { BlogArticleSeo } from './BlogSeo';

export default function BlogPostShell({ post: originalPost, extraSchemas, afterArticle = null, children }) {
  const { t, language } = useI18n();
  const post = getLocalizedPost(originalPost, language);
  const hasEnglishArticle = language === 'en' && Boolean(ENGLISH_POSTS[post.slug]);
  const related = BLOG_POSTS.filter((item) => ['compress-images-without-uploading', 'png-larger-after-compression', 'compress-without-losing-quality'].includes(item.slug) && item.slug !== post.slug).map((item) => getLocalizedPost(item, language));
  return (
    <BlogLayout>
      <BlogArticleSeo post={post} extraSchemas={hasEnglishArticle ? [] : extraSchemas} />

      <article className="blog-article max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <header className="mb-10">
          <BlogBreadcrumbs current={post.title} />
          <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-muted mb-4">
            <span className="blog-meta-pill">{t(post.category)}</span>
            <span>{t(post.readingTime)}</span>
            <span aria-hidden="true">·</span>
            <span>{t("作者")}<Link to="/about" className="hover:text-primary">{t("PicThin 项目维护者")}</Link></span>
            <span aria-hidden="true">·</span>
            <span>{t("更新于")}{t(post.dateModified)}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {t(post.articleTitle || post.title)}
          </h1>
        </header>

        {hasEnglishArticle ? <EnglishArticle slug={post.slug} /> : children}
        {related.length > 0 && <section aria-label={language === 'en' ? 'Related guides' : '相关阅读'}>
          <h2>{language === 'en' ? 'More help with compression' : '更多压缩问题'}</h2>
          <ul>{related.map((item) => <li key={item.path}><Link to={item.path}>{item.title}</Link></li>)}</ul>
        </section>}
      </article>

      {!hasEnglishArticle && afterArticle}
    </BlogLayout>
  );
}
