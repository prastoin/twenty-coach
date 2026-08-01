import { getStoredTokens, logout, refreshTokens } from './auth';

export type CurrentUser = {
  firstName: string;
  lastName: string;
  email: string;
};

// currentUser lives on the /metadata GraphQL schema, not /graphql
// (which only exposes workspace record queries).
const CURRENT_USER_QUERY =
  '{ currentUser { firstName lastName email } }';

const postMetadataQuery = async (accessToken: string) => {
  const response = await fetch(`${window.location.origin}/metadata`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query: CURRENT_USER_QUERY }),
  });
  return response.json();
};

export const fetchCurrentUser = async (): Promise<CurrentUser> => {
  const tokens = getStoredTokens();
  if (!tokens) {
    throw new Error('Not authenticated');
  }
  let result = await postMetadataQuery(tokens.accessToken);
  if (result.errors?.some((e: any) => e.extensions?.code === 'UNAUTHENTICATED')) {
    try {
      const refreshed = await refreshTokens();
      result = await postMetadataQuery(refreshed.accessToken);
    } catch {
      logout();
      throw new Error('Session expired: please sign in again');
    }
  }
  if (result.errors?.length) {
    throw new Error(result.errors[0].message);
  }
  return result.data.currentUser;
};
