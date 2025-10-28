import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { useTheme } from './shared/theme-provider';

// Simple test query to verify Apollo connection
const TEST_QUERY = gql`
  query TestConnection {
    __typename
  }
`;

export function ApolloTest(): JSX.Element {
  const { isDark } = useTheme();
  const { data, loading, error, refetch } = useQuery(TEST_QUERY, {
    errorPolicy: 'all',
  });

  const colors = {
    background: isDark ? '#18181b' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1e293b',
    secondary: isDark ? '#a1a1aa' : '#64748b',
    primary: isDark ? '#3b82f6' : '#0ea5e9',
    border: isDark ? '#334155' : '#e2e8f0',
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, borderColor: colors.border },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Apollo GraphQL Test
      </Text>

      {loading && (
        <Text style={[styles.status, { color: colors.secondary }]}>
          Connecting to GraphQL...
        </Text>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: '#ef4444' }]}>
            Connection Error
          </Text>
          <Text style={[styles.errorMessage, { color: colors.secondary }]}>
            {error.message}
          </Text>
        </View>
      )}

      {data && (
        <View style={styles.successContainer}>
          <Text style={[styles.successText, { color: '#10b981' }]}>
            ✓ Apollo Connected Successfully
          </Text>
          <Text style={[styles.successMessage, { color: colors.secondary }]}>
            GraphQL endpoint is responding
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: colors.primary }]}
        onPress={() => refetch()}
      >
        <Text style={styles.buttonText}>Test Connection</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  status: {
    fontSize: 14,
    marginBottom: 8,
  },
  errorContainer: {
    marginBottom: 12,
  },
  errorText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 14,
  },
  successContainer: {
    marginBottom: 12,
  },
  successText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  successMessage: {
    fontSize: 14,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
