import test from 'node:test';
import assert from 'node:assert/strict';
import { createMemoryRouter } from 'react-router-dom';
import { createClientRouterFactory } from '../src/utils/clientRouter.js';
import { onRequest } from '../functions/_middleware.js';

test('static pages navigate after deployment without fetching obsolete loader JSON', async () => {
  const definitions = [{ path: '/', children: [{ index: true }, { path: 'about' }, { path: 'tools' }] }];
  const createRouter = createClientRouterFactory(definitions, createMemoryRouter);
  let requests = 0;
  // Match the SSG library: it mutates the original routes after factory setup.
  const transform = (routes) => routes.map((route) => {
    route.loader = async () => { requests++; return JSON.parse('<!DOCTYPE html>'); };
    return { ...route, children: route.children ? transform(route.children) : undefined };
  });
  const router = createRouter(transform(definitions), { initialEntries: ['/'] });
  try {
    await router.navigate('/about');
    assert.equal(router.state.location.pathname, '/about');
    assert.equal(router.state.errors, null);
    await router.navigate('/tools');
    await router.navigate(-1);
    assert.equal(router.state.location.pathname, '/about');
    assert.equal(router.state.errors, null);
    assert.equal(requests, 0);
  } finally { router.dispose(); }
});

test('real data loaders and lazy routes retain their SSG loaders and router options', () => {
  const definitions = [{ path: '/', children: [{ path: 'data', loader: () => 'build data' }, { path: 'lazy', lazy: async () => ({}) }] }];
  const factory = createClientRouterFactory(definitions, (routes, options) => ({ routes, options }));
  const loader = () => 'static data';
  const transformed = [{ ...definitions[0], id: '0', loader, children: definitions[0].children.map((route) => ({ ...route, loader })) }];
  const options = { basename: '/app' };
  const result = factory(transformed, options);
  assert.equal(result.options, options);
  assert.equal(result.routes[0].id, '0');
  assert.equal(result.routes[0].loader, undefined);
  assert.equal(transformed[0].loader, loader);
  assert.ok(result.routes[0].children.every((route) => route.loader === loader));
});

test('old tabs receive empty JSON for removed manifests and route data instead of HTML', async () => {
  for (const path of ['/static-loader-data-manifest-old123.json', '/static-loader-data/about.old123.json', '/static-loader-data/admin/feedback.old123.json']) {
    for (const status of [200, 404]) {
      const response = await onRequest({ request: new Request('https://picthin.com' + path),
        next: () => new Response('<!DOCTYPE html><h1>Home</h1>', { status, headers: { 'Content-Type': 'text/html' } }) });
      assert.equal(response.status, 200);
      assert.match(response.headers.get('Content-Type'), /application\/json/);
      assert.equal(response.headers.get('Cache-Control'), 'no-store');
      assert.deepEqual(await response.json(), {});
    }
  }
});

test('existing data, failures, APIs, other JSON and POST requests are never masked', async () => {
  for (const [path, method, status, type, body] of [
    ['/static-loader-data/about.current.json', 'GET', 200, 'application/json', '{"0":null}'],
    ['/static-loader-data-manifest-current.json', 'GET', 200, 'application/json', '{"/about":"static-loader-data/about.current.json"}'],
    ['/static-loader-data/about.old.json', 'GET', 503, 'text/html', 'Unavailable'],
    ['/static-loader-data/about.old.json', 'GET', 403, 'text/html', 'Forbidden'],
    ['/api/feedback', 'GET', 404, 'application/json', '{"error":"missing"}'],
    ['/other.json', 'GET', 404, 'text/html', 'Missing'],
    ['/static-loader-data/about.old.json', 'POST', 404, 'text/html', 'Missing'],
  ]) {
    const response = await onRequest({ request: new Request('https://picthin.com' + path, { method }),
      next: () => new Response(body, { status, headers: { 'Content-Type': type } }) });
    assert.equal(response.status, status);
    assert.equal(await response.text(), body);
  }
});

test('legacy HEAD requests receive the JSON headers without a response body', async () => {
  const response = await onRequest({ request: new Request('https://picthin.com/static-loader-data/about.old.json', { method: 'HEAD' }),
    next: () => new Response(null, { status: 404 }) });
  assert.equal(response.status, 200);
  assert.match(response.headers.get('Content-Type'), /application\/json/);
  assert.equal(await response.text(), '');
});
