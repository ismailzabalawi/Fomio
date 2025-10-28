import React, { createContext, useContext, useEffect, useState } from 'react';
import { DataClient } from './client';
import { restClient } from './rest';
import { gqlClient } from './gql';
import { createApolloClient } from '../lib/apollo';
import { logger } from '@/shared/logger';

interface DataContextType {
  client: DataClient;
  isBffAvailable: boolean;
  isLoading: boolean;
  error: Error | null;
}

const DataContext = createContext<DataClient | null>(null);

interface DataProviderProps {
  children: React.ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [state, setState] = useState<DataContextType>({
    client: restClient, // Default to REST client
    isBffAvailable: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const initializeDataLayer = async () => {
      try {
        logger.info('Initializing data layer...');

        // Try to create Apollo client and check BFF availability
        const { client: apolloClient, isBffAvailable } =
          await createApolloClient();

        if (!isMounted) return;

        if (isBffAvailable) {
          logger.info('BFF is available, using GraphQL client');
          setState({
            client: gqlClient(apolloClient),
            isBffAvailable: true,
            isLoading: false,
            error: null,
          });
        } else {
          logger.info('BFF is not available, using REST client');
          setState({
            client: restClient,
            isBffAvailable: false,
            isLoading: false,
            error: null,
          });
        }
      } catch (error) {
        logger.error('Failed to initialize data layer', error);

        if (!isMounted) return;

        // Fallback to REST client on any error
        setState({
          client: restClient,
          isBffAvailable: false,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Unknown error'),
        });
      }
    };

    initializeDataLayer();

    return () => {
      isMounted = false;
    };
  }, []);

  // Show loading state while initializing
  if (state.isLoading) {
    return (
      <DataContext.Provider value={restClient}>{children}</DataContext.Provider>
    );
  }

  return (
    <DataContext.Provider value={state.client}>{children}</DataContext.Provider>
  );
}

export function useData(): DataClient {
  const client = useContext(DataContext);

  if (!client) {
    throw new Error('useData must be used within a DataProvider');
  }

  return client;
}

// Hook to get data layer status
export function useDataStatus() {
  const [state, setState] = useState<{
    isBffAvailable: boolean;
    isLoading: boolean;
    error: Error | null;
  }>({
    isBffAvailable: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { isBffAvailable } = await createApolloClient();
        setState({
          isBffAvailable,
          isLoading: false,
          error: null,
        });
      } catch (error) {
        setState({
          isBffAvailable: false,
          isLoading: false,
          error: error instanceof Error ? error : new Error('Unknown error'),
        });
      }
    };

    checkStatus();
  }, []);

  return state;
}

// Hook to manually switch data layer (for testing/debugging)
export function useDataLayerSwitch() {
  const [isBffAvailable, setIsBffAvailable] = useState(false);

  const switchToGraphQL = async () => {
    try {
      const { isBffAvailable: available } = await createApolloClient();
      setIsBffAvailable(available);
      logger.info('Switched to GraphQL data layer', { available });
    } catch (error) {
      logger.error('Failed to switch to GraphQL', error);
      setIsBffAvailable(false);
    }
  };

  const switchToREST = () => {
    setIsBffAvailable(false);
    logger.info('Switched to REST data layer');
  };

  return {
    isBffAvailable,
    switchToGraphQL,
    switchToREST,
  };
}
