import { defineLogicFunction, HTTPMethod } from 'twenty-sdk/define';
import { Response } from 'twenty-sdk/logic-function';
import { getPublicAssetUrl } from 'twenty-sdk/utils';

// Serves the trainee PWA at the stable /s/pwa URL. The public-asset route
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

// The page lives at /s/pwa (no trailing slash), so relative asset URLs
// would resolve one directory too high without an explicit base.
const BASE_TAG = '<base href="/s/pwa/">';

const handler = async (event: {
  requestContext?: { http?: { path?: string } };
}) => {
  // The wildcard path parameter arrives comma-joined (AWS payload
  // stringification), so the asset path is derived from the raw request
  // path instead.
  const requestPath = event.requestContext?.http?.path ?? '';
  const assetPath =
    decodeURIComponent(requestPath.replace(/^\/s\/pwa\/?/, '')) ||
    'index.html';

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
    body = body.replace('<head>', `<head>${BASE_TAG}`);
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
  description: 'Serves the trainee PWA at the stable /s/pwa URL',
  timeoutSeconds: 10,
  httpRouteTriggerSettings: {
    path: '/pwa{/*path}',
    httpMethod: HTTPMethod.GET,
    isAuthRequired: false,
  },
  handler,
});
