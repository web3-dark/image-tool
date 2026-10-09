// Capture this before ViteReactSSG mutates every route with a synthetic loader.
// Pages without build-time data can navigate without release-specific JSON files.
export function createClientRouterFactory(definitions, createRouter) {
  const capture = (routes) => routes.map((route) => ({
    needsLoader: Boolean(route.loader || route.lazy),
    children: route.children ? capture(route.children) : undefined,
  }));
  const policy = capture(definitions);
  const prepare = (routes, policies) => routes.map((route, index) => {
    const copy = { ...route };
    if (!policies[index].needsLoader) delete copy.loader;
    if (route.children) copy.children = prepare(route.children, policies[index].children);
    return copy;
  });
  return (routes, options) => createRouter(prepare(routes, policy), options);
}
