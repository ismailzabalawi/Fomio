import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useFeed, useCategories } from '../../hooks';

interface ReactQueryTestProps {
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
}

export function ReactQueryTest({ colors }: ReactQueryTestProps) {
  const {
    topics: feedData,
    loading: feedLoading,
    error: feedError,
    refresh: refetchFeed,
  } = useFeed();
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = useCategories();

  // Determine the status based on the hooks
  const isLoading = feedLoading || categoriesLoading;
  const hasError = feedError || categoriesError;
  const isDemo = !feedData && !categoriesData && !hasError;

  const getStatusMessage = () => {
    if (isLoading) return 'Loading... ⏳';
    if (hasError) return 'API Error - Check Configuration';
    if (feedData && categoriesData) {
      return `Connected! ${feedData.length} topics, ${categoriesData.categories.length} categories`;
    }
    if (isDemo) {
      return 'Demo Mode - Configure Discourse API';
    }
    return 'Unknown Status';
  };

  const getStatusColor = () => {
    if (isLoading) return colors.secondary;
    if (hasError) return '#ef4444';
    if (feedData && categoriesData) return colors.primary;
    return colors.secondary;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primary }]}>
        React Query Test
      </Text>

      <Text style={[styles.message, { color: colors.text }]}>
        React Query Hooks Test
      </Text>

      <Text style={[styles.status, { color: getStatusColor() }]}>
        {getStatusMessage()}
      </Text>

      <Text style={[styles.timestamp, { color: colors.secondary }]}>
        {new Date().toLocaleTimeString()}
      </Text>

      {feedData && (
        <Text style={[styles.status, { color: colors.primary }]}>
          Feed: {feedData.length} topics
        </Text>
      )}

      {categoriesData && (
        <Text style={[styles.status, { color: colors.primary }]}>
          Categories: {categoriesData.categories.length} categories
        </Text>
      )}

      {feedData && (
        <Text
          style={[styles.status, { color: colors.secondary, fontSize: 12 }]}
        >
          Connected to: meta.techrebels.info
        </Text>
      )}

      {hasError && (
        <Text style={[styles.status, { color: '#ef4444' }]}>
          Error: {feedError?.message || categoriesError?.message}
        </Text>
      )}

      <TouchableOpacity
        style={[styles.refreshButton, { backgroundColor: colors.primary }]}
        onPress={() => {
          refetchFeed();
          refetchCategories();
        }}
      >
        <Text style={[styles.refreshButtonText, { color: '#ffffff' }]}>
          Refresh All Data
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: 'rgba(0, 0, 0, 0.02)',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  status: {
    fontSize: 14,
    marginBottom: 8,
  },
  dataContainer: {
    alignItems: 'center',
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  refreshButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 6,
    marginTop: 16,
  },
  refreshButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
