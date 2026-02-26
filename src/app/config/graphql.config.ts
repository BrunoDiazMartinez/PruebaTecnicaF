import { InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';

export const GRAPHQL_ENDPOINT = 'https://countries.trevorblades.com/';

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({ uri: GRAPHQL_ENDPOINT }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first' as const,
        errorPolicy: 'all' as const,
      },
      query: {
        fetchPolicy: 'network-only' as const,
        errorPolicy: 'all' as const,
      },
    },
  };
}
