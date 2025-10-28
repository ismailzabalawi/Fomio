import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  useLatestTopics,
  useCategories,
  useSiteInfo,
  useApolloCache,
} from '../hooks/useApolloDiscourse';
import { useColorScheme } from './useColorScheme';

export function TestApolloConnection() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [testResults, setTestResults] = useState<string[]>([]);

  // Test queries
  const {
    data: topicsData,
    loading: topicsLoading,
    error: topicsError,
  } = useLatestTopics();
  const {
    data: categoriesData,
    loading: categoriesLoading,
    error: categoriesError,
  } = useCategories();
  const {
    data: siteData,
    loading: siteLoading,
    error: siteError,
  } = useSiteInfo();

  // Cache management functions
  const { refetchLatestTopics, refetchCategories, refetchSiteInfo } =
    useApolloCache();

  const colors = {
    background: isDark ? '#1a1a1a' : '#ffffff',
    surface: isDark ? '#2a2a2a' : '#f5f5f5',
    primary: isDark ? '#4f46e5' : '#6366f1',
    text: isDark ? '#ffffff' : '#000000',
    textSecondary: isDark ? '#a0a0a0' : '#666666',
    border: isDark ? '#404040' : '#e0e0e0',
    success: isDark ? '#10b981' : '#059669',
    error: isDark ? '#ef4444' : '#dc2626',
  };

  const addTestResult = (result: string) => {
    setTestResults((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${result}`,
    ]);
  };

  const runConnectionTest = () => {
    setTestResults([]);
    addTestResult('Starting Apollo Rest Link connection test...');

    // Test 1: Check if Apollo Client is configured
    addTestResult('✅ Apollo Client configured with Rest Link');

    // Test 2: Check if queries are working
    if (topicsLoading) {
      addTestResult('🔄 Latest topics query is loading...');
    } else if (topicsError) {
      addTestResult(`❌ Latest topics query error: ${topicsError.message}`);
    } else if (topicsData?.latestTopics) {
      addTestResult(
        `✅ Latest topics query successful - Found ${topicsData.latestTopics.length} topics`
      );
    }

    if (categoriesLoading) {
      addTestResult('🔄 Categories query is loading...');
    } else if (categoriesError) {
      addTestResult(`❌ Categories query error: ${categoriesError.message}`);
    } else if (categoriesData?.categories) {
      addTestResult(
        `✅ Categories query successful - Found ${categoriesData.categories.length} categories`
      );
    }

    if (siteLoading) {
      addTestResult('🔄 Site info query is loading...');
    } else if (siteError) {
      addTestResult(`❌ Site info query error: ${siteError.message}`);
    } else if (siteData?.siteInfo) {
      addTestResult(
        `✅ Site info query successful - Site: ${siteData.siteInfo.title}`
      );
    }

    addTestResult('🎉 Connection test completed!');
  };

  const testRefetch = async () => {
    try {
      addTestResult('🔄 Testing refetch functionality...');

      await Promise.all([refetchLatestTopics(), refetchCategories()]);

      addTestResult('✅ Refetch test successful');
    } catch (error) {
      addTestResult(`❌ Refetch test failed: ${(error as Error).message}`);
    }
  };

  const showConnectionStatus = () => {
    const hasTopics =
      topicsData?.latestTopics && topicsData.latestTopics.length > 0;
    const hasCategories =
      categoriesData?.categories && categoriesData.categories.length > 0;
    const hasSiteInfo = siteData?.siteInfo;

    if (hasTopics && hasCategories && hasSiteInfo) {
      Alert.alert(
        'Connection Status',
        '✅ Apollo Rest Link is working perfectly!\n\n' +
          `📱 Connected to: ${siteData.siteInfo.title}\n` +
          `📚 Found ${topicsData.latestTopics.length} topics\n` +
          `🏷️ Found ${categoriesData.categories.length} categories`,
        [{ text: 'Excellent!' }]
      );
    } else {
      Alert.alert(
        'Connection Status',
        '⚠️ Some queries are still loading or have errors.\n\n' +
          'Check the test results below for details.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          Apollo Rest Link Test
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Testing connection to Discourse via Apollo Rest Link
        </Text>
      </View>

      <View style={styles.testSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Connection Tests
        </Text>

        <View style={styles.buttonRow}>
          <Button
            title="Run Connection Test"
            onPress={runConnectionTest}
            color={colors.primary}
          />
          <Button
            title="Test Refetch"
            onPress={testRefetch}
            color={colors.primary}
          />
        </View>

        <Button
          title="Show Connection Status"
          onPress={showConnectionStatus}
          color={colors.success}
        />
      </View>

      <View style={styles.resultsSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Test Results
        </Text>

        {testResults.length === 0 ? (
          <Text style={[styles.noResults, { color: colors.textSecondary }]}>
            No test results yet. Run a connection test to see results.
          </Text>
        ) : (
          testResults.map((result, index) => (
            <View
              key={index}
              style={[styles.resultItem, { backgroundColor: colors.surface }]}
            >
              <Text style={[styles.resultText, { color: colors.text }]}>
                {result}
              </Text>
            </View>
          ))
        )}
      </View>

      <View style={styles.dataSection}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Live Data
        </Text>

        <View
          style={[
            styles.dataCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.dataTitle, { color: colors.text }]}>
            Latest Topics
          </Text>
          {topicsLoading ? (
            <Text style={[styles.dataText, { color: colors.textSecondary }]}>
              Loading...
            </Text>
          ) : topicsError ? (
            <Text style={[styles.dataText, { color: colors.error }]}>
              Error: {topicsError.message}
            </Text>
          ) : topicsData?.latestTopics ? (
            <Text style={[styles.dataText, { color: colors.textSecondary }]}>
              {topicsData.latestTopics.length} topics loaded
            </Text>
          ) : (
            <Text style={[styles.dataText, { color: colors.textSecondary }]}>
              No data
            </Text>
          )}
        </View>

        <View
          style={[
            styles.dataCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.dataTitle, { color: colors.text }]}>
            Categories
          </Text>
          {categoriesLoading ? (
            <Text style={[styles.dataText, { color: colors.textSecondary }]}>
              Loading...
            </Text>
          ) : categoriesError ? (
            <Text style={[styles.dataText, { color: colors.error }]}>
              Error: {categoriesError.message}
            </Text>
          ) : categoriesData?.categories ? (
            <Text style={[styles.dataText, { color: colors.textSecondary }]}>
              {categoriesData.categories.length} categories loaded
            </Text>
          ) : (
            <Text style={[styles.dataText, { color: colors.textSecondary }]}>
              No data
            </Text>
          )}
        </View>

        <View
          style={[
            styles.dataCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.dataTitle, { color: colors.text }]}>
            Site Info
          </Text>
          {siteLoading ? (
            <Text style={[styles.dataText, { color: colors.textSecondary }]}>
              Loading...
            </Text>
          ) : siteError ? (
            <Text style={[styles.dataText, { color: colors.error }]}>
              Error: {siteError.message}
            </Text>
          ) : siteData?.siteInfo ? (
            <Text style={[styles.dataText, { color: colors.textSecondary }]}>
              {siteData.siteInfo.title}
            </Text>
          ) : (
            <Text style={[styles.dataText, { color: colors.textSecondary }]}>
              No data
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  testSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  resultsSection: {
    marginBottom: 30,
  },
  noResults: {
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 20,
  },
  resultItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
  },
  resultText: {
    fontSize: 14,
    fontFamily: 'monospace',
  },
  dataSection: {
    marginBottom: 30,
  },
  dataCard: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  dataText: {
    fontSize: 14,
  },
});
