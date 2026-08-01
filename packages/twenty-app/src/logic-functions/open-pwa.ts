import { defineLogicFunction, HTTPMethod } from 'twenty-sdk/define';
import { Response } from 'twenty-sdk/logic-function';
import { getPublicAssetUrl } from 'twenty-sdk/utils';

// The trainee PWA lives under the app's public assets, whose URL embeds
// the workspace and application ids — both change on reinstall. This
// route is the stable entry point (/s/pwa): it resolves the current
// asset URL at runtime and hops there. A real 302 is impossible because
// Location is not on the route-response header allow-list.
const handler = async () => {
  const url = getPublicAssetUrl('pwa/index.html');
  const html = `<!doctype html>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0;url=${url}">
<script>window.location.replace(${JSON.stringify(url)});</script>
<a href="${url}">Open the trainee app</a>`;
  return new Response(html, {
    status: 200,
    headers: { 'content-type': 'text/html' },
  });
};

export default defineLogicFunction({
  universalIdentifier: 'e523d181-4dc8-4ca3-9d8a-d982526d2583',
  name: 'open-pwa',
  description: 'Stable entry point that forwards to the trainee PWA assets',
  timeoutSeconds: 10,
  httpRouteTriggerSettings: {
    path: '/pwa',
    httpMethod: HTTPMethod.GET,
    isAuthRequired: false,
  },
  handler,
});
