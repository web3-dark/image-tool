import { Link } from 'react-router-dom';

export default function BlogBreadcrumbs({ current }) {
  return (
    <p className="text-sm text-foreground-muted mb-3">
      <Link to="/" className="hover:text-primary">首页</Link>
      <span className="mx-2">/</span>
      {current === '博客' ? (
        <span>博客</span>
      ) : (
        <>
          <Link to="/blog" className="hover:text-primary">博客</Link>
          <span className="mx-2">/</span>
          <span>{current}</span>
        </>
      )}
    </p>
  );
}
