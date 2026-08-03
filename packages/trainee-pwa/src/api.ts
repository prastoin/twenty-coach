import type { MetadataSchema } from 'twenty-client-sdk/metadata';

import { authorizedFetch } from './client';

// The metadata schema is the server's own, so unlike the core client it
// ships fully generated in the SDK — these types need no emit step.
export type CurrentUser = Pick<
  MetadataSchema.User,
  'firstName' | 'lastName' | 'email'
> & {
  /** Identity every record we write is attributed to. */
  workspaceMemberId: string | null;
};

// Type-only import above: `MetadataApiClient` itself cannot be used here,
// as it evaluates `process.env.TWENTY_API_URL` at module scope and throws
// on import in a browser, and the underlying `createClient` is not exported
// from the package entry. One query doesn't justify vendoring a second
// generated client, so the request stays explicit.
export const fetchCurrentUser = async (): Promise<CurrentUser> => {
  const response = await authorizedFetch(`${window.location.origin}/metadata`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query:
        '{ currentUser { firstName lastName email workspaceMember { id } } }',
    }),
  });
  const result = (await response.json()) as {
    data?: {
      currentUser: Omit<CurrentUser, 'workspaceMemberId'> & {
        workspaceMember?: { id: string } | null;
      };
    };
    errors?: { message: string }[];
  };
  if (result.errors?.length) {
    throw new Error(result.errors[0].message);
  }
  if (!result.data) {
    throw new Error('No data returned for currentUser');
  }
  const { workspaceMember, ...user } = result.data.currentUser;
  return { ...user, workspaceMemberId: workspaceMember?.id ?? null };
};
