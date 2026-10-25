import { defineLogicFunction, HTTPMethod } from 'twenty-sdk/define';
import { Response } from 'twenty-sdk/logic-function';
import { getPublicAssetUrl } from 'twenty-sdk/utils';

// Serves the trainee PWA from a stable app route. The public-asset route
// cannot host app pages directly: it sends Content-Disposition: attachment
// (anti-XSS posture for served files), so browsers download instead of
// render. This route fetches the assets server-side and re-serves them
// inline. It also hides the asset URL's workspace/application ids, which
// change on every reinstall.
//
// Text assets only (Response bodies are strings) — enough for the
// current build; binary icons would need base64 support server-side.
const CONTENT_TYPES: Record<string, string> = {
  html: 'text/html; charset=utf-8',
  js: 'text/javascript; charset=utf-8',
  css: 'text/css; charset=utf-8',
  svg: 'image/svg+xml',
  webmanifest: 'application/manifest+json',
  json: 'application/json',
  map: 'application/json',
};

const ROUTE_ROOT = '/pwa';

const escapeAttribute = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

/**
 * Splits a request path into the directory the page is served from and the
 * asset below it.
 *
 * The prefix is not ours to assume. The same function answers on the legacy
 * `/s/pwa` route and, once an instance configures a public function
 * hostname, on `/pwa` at `<workspace>.<hostname>` — see #35. Hardcoding
 * either one breaks the other silently, so both are read off the request.
 */
const splitRequestPath = (
  requestPath: string,
): { baseHref: string; assetPath: string } => {
  const rootIndex = requestPath.indexOf(ROUTE_ROOT);
  if (rootIndex === -1) {
    return { baseHref: `${ROUTE_ROOT}/`, assetPath: '' };
  }
  const rootEnd = rootIndex + ROUTE_ROOT.length;
  return {
    baseHref: `${requestPath.slice(0, rootEnd)}/`,
    assetPath: requestPath.slice(rootEnd).replace(/^\//, ''),
  };
};

const handler = async (event: {
  requestContext?: { http?: { path?: string } };
}) => {
  // The wildcard path parameter arrives comma-joined (AWS payload
  // stringification), so the asset path is derived from the raw request
  // path instead.
  const requestPath = event.requestContext?.http?.path ?? '';
  const { baseHref, assetPath: rawAssetPath } = splitRequestPath(requestPath);
  const assetPath = decodeURIComponent(rawAssetPath) || 'index.html';

  const extension = assetPath.split('.').pop() ?? '';
  if (assetPath.includes('..') || !CONTENT_TYPES[extension]) {
    return new Response('Not found', { status: 404 });
  }

  const upstream = await fetch(getPublicAssetUrl(`pwa/${assetPath}`));
  if (!upstream.ok) {
    return new Response('Not found', { status: 404 });
  }
  let body = await upstream.text();
  if (assetPath === 'index.html') {
    // The page has no trailing slash, so relative asset URLs would resolve
    // one directory too high without an explicit base. It comes from the
    // request, hence the escaping.
    body = body.replace(
      '<head>',
      `<head><base href="${escapeAttribute(baseHref)}">`,
    );
  }

  return new Response(body, {
    status: 200,
    headers: {
      'content-type': CONTENT_TYPES[extension],
      // Vite content-hashes everything under assets/; the entry points
      // must revalidate so deploys show up.
      'cache-control': assetPath.startsWith('assets/')
        ? 'public, max-age=31536000, immutable'
        : 'no-cache',
    },
  });
};

export default defineLogicFunction({
  universalIdentifier: 'e523d181-4dc8-4ca3-9d8a-d982526d2583',
  name: 'open-pwa',
  description: 'Serves the trainee PWA under whichever route prefix answers',
  timeoutSeconds: 10,
  httpRouteTriggerSettings: {
    path: '/pwa{/*path}',
    httpMethod: HTTPMethod.GET,
    isAuthRequired: false,
  },
  handler,
});
