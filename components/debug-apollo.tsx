import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useBffFeed, useBffCategories } from '../hooks';

export const DebugApollo: React.FC = () => {
  const {
    data: topicsData,
    isLoading: topicsLoading,
    error: topicsError,
  } = useBffFeed();
  const {
    data: categoriesData,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useBffCategories();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Apollo Debug Info</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Latest Topics:</Text>
        <Text>Loading: {topicsLoading ? 'Yes' : 'No'}</Text>
        <Text>Error: {topicsError ? topicsError.message : 'None'}</Text>
        <Text>
          Data: {topicsData ? JSON.stringify(topicsData.topics, null, 2) : 'No data'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories:</Text>
        <Text>Loading: {categoriesLoading ? 'Yes' : 'No'}</Text>
        <Text>Error: {categoriesError ? categoriesError.message : 'None'}</Text>
        <Text>
          Data:{' '}
          {categoriesData ? JSON.stringify(categoriesData.categories, null, 2) : 'No data'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 10,
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
});
