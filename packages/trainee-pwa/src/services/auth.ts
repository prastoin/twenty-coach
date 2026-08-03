// OAuth 2.0 authorization-code + PKCE against the Twenty instance the PWA
// is served from. The client registers itself dynamically on first use
// (anonymous registration is enabled server-side); the CLI public client
// is the fallback when registration is disabled.

const CLIENT_STORAGE_KEY = 'coachPwa.oauthClient';
const TOKENS_STORAGE_KEY = 'coachPwa.tokens';
const VERIFIER_STORAGE_KEY = 'coachPwa.pkceVerifier';

export type Tokens = {
  accessToken: string;
  refreshToken?: string;
};

type Discovery = {
  authorization_endpoint: string;
  token_endpoint: string;
  registration_endpoint?: string;
  cli_client_id?: string;
};

const origin = window.location.origin;
// Exact page URL (no query/hash): both the registered redirect URI and the
// one sent on authorize/token calls, so they always match.
const redirectUri = origin + window.location.pathname;

// Discovery returns absolute URLs on the instance origin. The PWA is
// same-origin in production, and the Vite dev server proxies these paths,
// so fetches always go through the page origin (navigations stay absolute).
const toSameOriginUrl = (endpoint: string): string => {
  const url = new URL(endpoint);
  return origin + url.pathname + url.search;
};

const base64UrlEncode = (bytes: Uint8Array): string =>
  btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

const createPkcePair = async () => {
  const verifier = base64UrlEncode(
    crypto.getRandomValues(new Uint8Array(32)),
  );
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(verifier),
  );
  return { verifier, challenge: base64UrlEncode(new Uint8Array(digest)) };
};

const discover = async (): Promise<Discovery> => {
  const response = await fetch(
    `${origin}/.well-known/oauth-authorization-server`,
  );
  if (!response.ok) {
    throw new Error(`OAuth discovery failed (${response.status})`);
  }
  return response.json();
};

const getClientId = async (discovery: Discovery): Promise<string> => {
  const cached = localStorage.getItem(CLIENT_STORAGE_KEY);
  if (cached) {
    const parsed = JSON.parse(cached);
    if (parsed.redirectUri === redirectUri) {
      return parsed.clientId;
    }
  }
  if (discovery.registration_endpoint) {
    const response = await fetch(toSameOriginUrl(discovery.registration_endpoint), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: 'Coach Twenty PWA',
        redirect_uris: [redirectUri],
        grant_types: ['authorization_code', 'refresh_token'],
        response_types: ['code'],
        token_endpoint_auth_method: 'none',
      }),
    });
    if (response.ok) {
      const { client_id: clientId } = await response.json();
      localStorage.setItem(
        CLIENT_STORAGE_KEY,
        JSON.stringify({ clientId, redirectUri }),
      );
      return clientId;
    }
  }
  if (discovery.cli_client_id) {
    return discovery.cli_client_id;
  }
  throw new Error('No usable OAuth client: registration failed');
};

export const login = async (): Promise<void> => {
  const discovery = await discover();
  const clientId = await getClientId(discovery);
  const { verifier, challenge } = await createPkcePair();
  sessionStorage.setItem(VERIFIER_STORAGE_KEY, verifier);

  const authorizeUrl = new URL(discovery.authorization_endpoint);
  authorizeUrl.searchParams.set('clientId', clientId);
  authorizeUrl.searchParams.set('codeChallenge', challenge);
  authorizeUrl.searchParams.set('redirectUrl', redirectUri);
  window.location.assign(authorizeUrl.toString());
};

const exchangeToken = async (
  body: Record<string, string>,
): Promise<Tokens> => {
  const discovery = await discover();
  const clientId = await getClientId(discovery);
  const response = await fetch(toSameOriginUrl(discovery.token_endpoint), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...body, client_id: clientId }),
  });
  if (!response.ok) {
    throw new Error(`Token request failed (${response.status})`);
  }
  const { access_token, refresh_token } = await response.json();
  const tokens: Tokens = {
    accessToken: access_token,
    refreshToken: refresh_token,
  };
  localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(tokens));
  return tokens;
};

/** Completes the login when the page is loaded back with ?code=… */
export const handleAuthorizationCallback = async (): Promise<
  Tokens | null
> => {
  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  if (!code) {
    return null;
  }
  const verifier = sessionStorage.getItem(VERIFIER_STORAGE_KEY);
  sessionStorage.removeItem(VERIFIER_STORAGE_KEY);
  window.history.replaceState(null, '', redirectUri);
  if (!verifier) {
    throw new Error('Missing PKCE verifier: please retry the login');
  }
  return exchangeToken({
    grant_type: 'authorization_code',
    code,
    code_verifier: verifier,
    redirect_uri: redirectUri,
  });
};

export const getStoredTokens = (): Tokens | null => {
  const raw = localStorage.getItem(TOKENS_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
};

let refreshInFlight: Promise<Tokens> | null = null;

/**
 * Single-flight: the instance rotates refresh tokens, so two requests that
 * expire together must not each spend one. The second would present a token
 * already consumed by the first, fail, and sign the trainee out mid-session.
 */
export const refreshTokens = async (): Promise<Tokens> => {
  refreshInFlight ??= (async () => {
    try {
      const tokens = getStoredTokens();
      if (!tokens?.refreshToken) {
        throw new Error('No refresh token');
      }
      return await exchangeToken({
        grant_type: 'refresh_token',
        refresh_token: tokens.refreshToken,
      });
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
};

export const logout = (): void => {
  localStorage.removeItem(TOKENS_STORAGE_KEY);
};
