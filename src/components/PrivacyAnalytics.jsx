import { useEffect } from 'react';

const ANALYTICS_TOKEN = import.meta.env.VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN?.trim();

export default function PrivacyAnalytics() {
  useEffect(() => {
    if (!ANALYTICS_TOKEN || document.querySelector('script[data-cf-beacon]')) return;

    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://static.cloudflareinsights.com/beacon.min.js';
    script.dataset.cfBeacon = JSON.stringify({ token: ANALYTICS_TOKEN });
    document.body.appendChild(script);
  }, []);

  return null;
}
