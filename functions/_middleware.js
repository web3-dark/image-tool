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
  if (response.headers.get('content-type')?.includes('text/html') || requestUrl.pathname === '/sw.js') {
    const freshResponse = new Response(response.body, response);
    freshResponse.headers.set('Cache-Control', 'no-cache');
    return freshResponse;
  }
  return response;
}
