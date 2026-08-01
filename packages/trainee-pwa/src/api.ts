import { authorizedFetch } from './client';

export type CurrentUser = {
  firstName: string;
  lastName: string;
  email: string;
};

// The /metadata schema has its own generated client upstream, which we don't
// emit — this is the only query the PWA needs from it, so it stays a plain
// request rather than vendoring a second client.
export const fetchCurrentUser = async (): Promise<CurrentUser> => {
  const response = await authorizedFetch(
    `${window.location.origin}/metadata`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: '{ currentUser { firstName lastName email } }',
      }),
    },
  );
  const result = await response.json();
  if (result.errors?.length) {
    throw new Error(result.errors[0].message);
  }
  return result.data.currentUser;
};
