import { createClient } from '@coach-twenty/shared/api';

import { getStoredTokens, logout, refreshTokens } from './auth';

type GraphqlBody = {
  errors?: { message?: string; extensions?: { code?: string } }[];
};

// An expired token is not a 401: the API answers 200 with an UNAUTHENTICATED
// error in the GraphQL payload, so the body has to be inspected too.
const isExpiredTokenResponse = (status: number, body: string): boolean => {
  if (status === 401) {
    return true;
  }
  try {
    const parsed = JSON.parse(body) as GraphqlBody;
    return Boolean(
      parsed.errors?.some(
        (error) => error.extensions?.code === 'UNAUTHENTICATED',
      ),
    );
  } catch {
    return false;
  }
};

const replay = (response: Response, body: string): Response =>
  new Response(body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });

/**
 * Sends a request with the trainee's access token, refreshing once and
 * replaying if the instance rejects it as expired.
 */
export const authorizedFetch = async (
  url: string,
  init: RequestInit = {},
): Promise<Response> => {
  const send = () => {
    const tokens = getStoredTokens();
    if (!tokens) {
      throw new Error('Not authenticated');
    }
    return fetch(url, {
      ...init,
      headers: {
        ...(init.headers as Record<string, string>),
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
  };

  // The body is read here rather than by the caller, so it has to be handed
  // back as a fresh Response.
  const response = await send();
  const body = await response.text();
  if (!isExpiredTokenResponse(response.status, body)) {
    return replay(response, body);
  }

  try {
    await refreshTokens();
  } catch {
    logout();
    throw new Error('Session expired: please sign in again');
  }
  const retried = await send();
  return replay(retried, await retried.text());
};

// Typed queries and mutations against the instance serving the PWA. The
// generated client only builds the operation; auth and retries stay in
// authorizedFetch.
export const coreClient = createClient({
  url: `${window.location.origin}/graphql`,
  fetch: authorizedFetch,
});
