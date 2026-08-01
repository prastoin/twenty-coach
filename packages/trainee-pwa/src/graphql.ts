import { getStoredTokens, logout, refreshTokens } from './auth';

type GraphqlEndpoint = '/graphql' | '/metadata';

const post = async (
  endpoint: GraphqlEndpoint,
  accessToken: string,
  query: string,
  variables?: Record<string, unknown>,
) => {
  const response = await fetch(`${window.location.origin}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
};

const isUnauthenticated = (result: any): boolean =>
  Boolean(
    result.errors?.some(
      (error: any) => error.extensions?.code === 'UNAUTHENTICATED',
    ),
  );

/** Authenticated GraphQL call with a one-shot token refresh on expiry. */
export const graphqlRequest = async <T>(
  endpoint: GraphqlEndpoint,
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> => {
  const tokens = getStoredTokens();
  if (!tokens) {
    throw new Error('Not authenticated');
  }
  let result = await post(endpoint, tokens.accessToken, query, variables);
  if (isUnauthenticated(result)) {
    try {
      const refreshed = await refreshTokens();
      result = await post(endpoint, refreshed.accessToken, query, variables);
    } catch {
      logout();
      throw new Error('Session expired: please sign in again');
    }
  }
  if (result.errors?.length) {
    throw new Error(result.errors[0].message);
  }
  return result.data as T;
};
