import { Link } from 'react-router-dom';
import BlogBreadcrumbs from '../../components/blog/BlogBreadcrumbs';
import BlogLayout from '../../components/BlogLayout';
import { BlogIndexSeo } from '../../components/blog/BlogSeo';
import { BLOG_POSTS } from '../../config/content';

const DESCRIPTION = 'picthin 图片压缩指南：学习 JPG、PNG、WebP、AVIF 的压缩原理、格式选择、安全处理和批量优化方法。';

export default function BlogIndex() {
  return (
    <BlogLayout>
      <BlogIndexSeo description={DESCRIPTION} />

      <section className="max-w-3xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <header className="mb-10">
          <BlogBreadcrumbs current="博客" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            图片压缩指南
          </h1>
          <p className="text-base text-foreground-muted mt-4 leading-7">
            从实际问题出发，讲清楚图片为什么会变大、怎么压小、什么时候该换格式，以及如何在不上传图片的前提下安全处理。
          </p>
        </header>

        <div className="divide-y divide-border border-y border-border">
          {BLOG_POSTS.map((post) => (
            <article key={post.path} className="py-6">
              <Link to={post.path} className="group block">
                <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-muted mb-3">
                  <span className="blog-meta-pill">{post.category}</span>
                  <span>{post.readingTime}</span>
                  <span aria-hidden="true">·</span>
                  <span>更新于 {post.dateModified}</span>
                </div>
                <h2 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-base text-foreground-muted leading-7 mt-3">
                  {post.description}
                </p>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </BlogLayout>
  );
}
