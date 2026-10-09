import { useI18n } from '../../i18n/useI18n.js';
import { Link } from '../LocalizedLink.jsx';

export default function BlogBreadcrumbs({ current }) {
  const { t } = useI18n();
  return (
    <p className="text-sm text-foreground-muted mb-3">
      <Link to="/" className="hover:text-primary">{t("首页")}</Link>
      <span className="mx-2">/</span>
      {current === '博客' ? (
        <span>{t("博客")}</span>
      ) : (
        <>
          <Link to="/blog" className="hover:text-primary">{t("博客")}</Link>
          <span className="mx-2">/</span>
          <span>{t(current)}</span>
        </>
      )}
    </p>
  );
}
