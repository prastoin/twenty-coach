import { createClient } from '@coach-twenty/shared/api';

import { getStoredTokens, logout, refreshTokens } from './auth';

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

  const response = await send();
  if (response.status !== 401) {
    return response;
  }
  try {
    await refreshTokens();
  } catch {
    logout();
    throw new Error('Session expired: please sign in again');
  }
  return send();
};

// Typed queries and mutations against the instance serving the PWA. The
// generated client only builds the operation; auth and retries stay in
// authorizedFetch.
export const coreClient = createClient({
  url: `${window.location.origin}/graphql`,
  fetch: authorizedFetch,
});
