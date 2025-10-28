import React from 'react';
import { ApolloProvider as BaseApolloProvider } from '@apollo/client/react';
import { apolloClient } from '@/lib/apollo';
import { logger } from '@/shared/logger';
import { GRAPHQL_ENDPOINT } from '@/config/api';

interface ApolloProviderProps {
  children: React.ReactNode;
}

export function ApolloProvider({ children }: ApolloProviderProps) {
  React.useEffect(() => {
    // Log Apollo Client initialization
    logger.info('Apollo Client initialized', {
      uri: GRAPHQL_ENDPOINT,
      cache: apolloClient.cache ? 'initialized' : 'not initialized',
    });
  }, []);

  return (
    <BaseApolloProvider client={apolloClient}>{children}</BaseApolloProvider>
  );
}
