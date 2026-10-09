const CANONICAL_ORIGIN = 'https://picthin.com';
const DUPLICATE_HOSTS = new Set([
  'image-tool-bk5.pages.dev',
  'www.picthin.com',
]);

export async function onRequest(context) {
  const requestUrl = new URL(context.request.url);

  if (DUPLICATE_HOSTS.has(requestUrl.hostname.toLowerCase())) {
    const canonicalUrl = new URL(`${requestUrl.pathname}${requestUrl.search}`, CANONICAL_ORIGIN);
    return Response.redirect(canonicalUrl, 301);
  }

  const response = await context.next();
  if (requestUrl.pathname.startsWith('/admin/')) {
    const privateResponse = new Response(response.body, response);
    privateResponse.headers.set('Cache-Control', 'no-store');
    privateResponse.headers.set('X-Robots-Tag', 'noindex, nofollow');
    privateResponse.headers.set('Referrer-Policy', 'no-referrer');
    return privateResponse;
  }
  if (response.headers.get('content-type')?.includes('text/html') || requestUrl.pathname === '/sw.js') {
    const freshResponse = new Response(response.body, response);
    freshResponse.headers.set('Cache-Control', 'no-cache');
    return freshResponse;
  }
  return response;
}
