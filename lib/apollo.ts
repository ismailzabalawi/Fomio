import { ApolloClient, InMemoryCache, HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from '@/shared/logger';
import { GRAPHQL_ENDPOINT } from '@/config/api';

// Health check function to determine BFF availability
async function checkHealth(timeoutMs = 1200): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    const response = await fetch(
      `${GRAPHQL_ENDPOINT.replace('/graphql', '/health')}`,
      {
        signal: controller.signal,
        method: 'GET',
      }
    );

    clearTimeout(timeout);
    const isHealthy = response.ok;

    logger.info('BFF Health Check', {
      url: GRAPHQL_ENDPOINT.replace('/graphql', '/health'),
      status: response.status,
      healthy: isHealthy,
    });

    return isHealthy;
  } catch (error) {
    logger.warn('BFF Health Check Failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      url: GRAPHQL_ENDPOINT.replace('/graphql', '/health'),
    });
    return false;
  }
}

// Create HTTP link to your BFF GraphQL endpoint
const httpLink = new HttpLink({
  uri: GRAPHQL_ENDPOINT,
});

// Auth link to add authentication headers
const authLink = setContext(async (_, { headers }) => {
  try {
    // Get auth token from secure storage
    const token = await AsyncStorage.getItem('access_token');

    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
  } catch (error) {
    logger.error('Failed to get auth token for Apollo request', error);
    return { headers };
  }
});

// Error link for handling GraphQL errors
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }: any) => {
    if (graphQLErrors?.length) {
      logger.warn(
        `[GQL errors] ${operation.operationName ?? ''}`,
        graphQLErrors.map((e: any) => ({
          msg: e.message,
          path: e.path,
          code: e.extensions?.code,
        }))
      );
    }

    if (networkError) {
      const statusCode = (networkError as any)?.statusCode;
      const isBffUnavailable =
        statusCode === 0 ||
        (networkError as any)?.message?.includes('Network request failed');

      logger.warn('[Network error]', {
        message: (networkError as any)?.message,
        statusCode,
        operation: operation.operationName,
        isBffUnavailable,
      });

      // Mark the error with a cause for the data layer to handle
      if (isBffUnavailable) {
        (networkError as any).cause = 'BFF_UNAVAILABLE';
      }
    }
  }
);

// Create Apollo Client with conditional link setup
export async function createApolloClient() {
  const isBffAvailable = await checkHealth();

  logger.info('Apollo Client Setup', {
    isBffAvailable,
    endpoint: GRAPHQL_ENDPOINT,
  });

  const client = new ApolloClient({
    link: from([
      errorLink,
      ...(isBffAvailable ? [authLink, httpLink] : []), // Only add auth and http links if BFF is available
    ]),
    cache: new InMemoryCache({
      typePolicies: {
        // Define cache policies for better performance
        Query: {
          fields: {
            feed: {
              keyArgs: false, // cursor-based pagination
              merge(existing, incoming) {
                if (!existing) return incoming;
                return {
                  ...incoming,
                  edges: [...(existing.edges ?? []), ...(incoming.edges ?? [])],
                  pageInfo: incoming.pageInfo,
                };
              },
            },
          },
        },
        // Cache policy for individual topics/bytes
        Topic: {
          fields: {
            posts: {
              merge(existing = [], incoming) {
                return [...existing, ...incoming];
              },
            },
          },
        },
      },
    }),
    // Default options for queries
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-first',
        nextFetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
        notifyOnNetworkStatusChange: true,
      },
      query: {
        fetchPolicy: isBffAvailable ? 'network-only' : 'cache-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });

  return { client, isBffAvailable };
}

// Legacy export for backward compatibility
export const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          feed: {
            keyArgs: false,
            merge(existing, incoming) {
              if (!existing) return incoming;
              return {
                ...incoming,
                edges: [...(existing.edges ?? []), ...(incoming.edges ?? [])],
                pageInfo: incoming.pageInfo,
              };
            },
          },
        },
      },
      Topic: {
        fields: {
          posts: {
            merge(existing = [], incoming) {
              return [...existing, ...incoming];
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-first',
      nextFetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

// Helper function to clear cache (useful for logout)
export const clearApolloCache = async () => {
  try {
    await apolloClient.clearStore();
    logger.info('Apollo cache cleared successfully');
  } catch (error) {
    logger.error('Failed to clear Apollo cache', error);
  }
};

// Helper function to reset cache and refetch queries
export const resetApolloCache = async () => {
  try {
    await apolloClient.resetStore();
    logger.info('Apollo cache reset successfully');
  } catch (error) {
    logger.error('Failed to reset Apollo cache', error);
  }
};
