import BlogLayout from '../BlogLayout';
import BlogBreadcrumbs from './BlogBreadcrumbs';
import { BlogArticleSeo } from './BlogSeo';

export default function BlogPostShell({ post, extraSchemas, afterArticle = null, children }) {
  return (
    <BlogLayout>
      <BlogArticleSeo post={post} extraSchemas={extraSchemas} />

      <article className="blog-article max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <header className="mb-10">
          <BlogBreadcrumbs current={post.title} />
          <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-muted mb-4">
            <span className="blog-meta-pill">{post.category}</span>
            <span>{post.readingTime}</span>
            <span aria-hidden="true">·</span>
            <span>更新于 {post.dateModified}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {post.articleTitle || post.title}
          </h1>
        </header>

        {children}
      </article>

      {afterArticle}
    </BlogLayout>
  );
}
