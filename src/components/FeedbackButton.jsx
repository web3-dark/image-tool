import { lazy, Suspense, useState } from 'react';

const FeedbackDialog = lazy(() => import('./FeedbackDialog.jsx'));

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  return <>
    <button type="button" onClick={() => setOpen(true)} className="underline underline-offset-2 hover:text-primary transition-colors">
      意见反馈
    </button>
    {open && <Suspense fallback={<span role="status" className="text-sm">正在打开…</span>}>
      <FeedbackDialog onClose={() => setOpen(false)} />
    </Suspense>}
  </>;
}
