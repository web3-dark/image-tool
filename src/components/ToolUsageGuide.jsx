import { useI18n } from '../i18n/useI18n.js';
import { Link } from './LocalizedLink.jsx';

export default function ToolUsageGuide({ guide }) {
  const { t } = useI18n();
  if (!guide) return null;

  return (
    <section>
      <h2>{t(guide.title)}</h2>
      <ol>
        {guide.steps.map((step) => <li key={step}>{t(step)}</li>)}
      </ol>
      <p>{t(guide.check)}</p>
      <p>{t("查看完整教程：")}<Link to={guide.path}>{t(guide.label)}</Link>{t("。")}</p>
    </section>
  );
}
