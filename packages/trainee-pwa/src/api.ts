import { graphqlRequest } from './graphql';

export type CurrentUser = {
  firstName: string;
  lastName: string;
  email: string;
};

// currentUser lives on the /metadata GraphQL schema, not /graphql
// (which only exposes workspace record queries).
export const fetchCurrentUser = async (): Promise<CurrentUser> => {
  const data = await graphqlRequest<{ currentUser: CurrentUser }>(
    '/metadata',
    '{ currentUser { firstName lastName email } }',
  );
  return data.currentUser;
};
