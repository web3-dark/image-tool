import { useI18n } from '../../i18n/useI18n.js';
import { Link } from 'react-router-dom';
import BlogLayout from '../BlogLayout';
import BlogBreadcrumbs from './BlogBreadcrumbs';
import { BlogArticleSeo } from './BlogSeo';

export default function BlogPostShell({ post, extraSchemas, afterArticle = null, children }) {
  const { t } = useI18n();
  return (
    <BlogLayout>
      <BlogArticleSeo post={post} extraSchemas={extraSchemas} />

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

        {children}
      </article>

      {afterArticle}
    </BlogLayout>
  );
}
