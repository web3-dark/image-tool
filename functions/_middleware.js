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
  // Older open tabs request hashed SSG files removed by a later deployment.
  // All legacy releases contain empty loader data; serve that empty value instead
  // of Pages' HTML fallback. Keep existing JSON and real server errors untouched.
  const legacyLoaderFile = /^\/static-loader-data-manifest-[a-z0-9]+\.json$/.test(requestUrl.pathname)
    || /^\/static-loader-data\/(?:[a-z0-9-]+\/)*[a-z0-9-]+\.[a-z0-9]+\.json$/.test(requestUrl.pathname);
  if (['GET', 'HEAD'].includes(context.request.method) && legacyLoaderFile
    && (response.status === 404 || (response.ok && response.headers.get('content-type')?.includes('text/html')))) {
    await response.body?.cancel();
    return new Response(context.request.method === 'HEAD' ? null : '{}', {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff',
        'X-Robots-Tag': 'noindex, nofollow',
      },
    });
  }
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
