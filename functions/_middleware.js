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

  return context.next();
}
