import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';

const mockByte = {
  id: '1',
  content: 'Just discovered this amazing new feature! The possibilities are endless. #innovation #tech',
  author: {
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&h=150&fit=crop&crop=face',
  },
  likes: 42,
  comments: 8,
  tags: ['innovation', 'tech'],
  timestamp: '2h ago',
  commentsList: [
    { id: 'c1', author: 'Jane', content: 'Awesome!', timestamp: '1h ago' },
    { id: 'c2', author: 'Sam', content: 'Congrats!', timestamp: '30m ago' },
  ],
};

export default function ByteDetailsScreen() {
  const { byteId } = useLocalSearchParams();
  // In a real app, fetch the byte by ID
  const byte = mockByte;

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Byte</Text>
        <View style={styles.headerPlaceholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.authorRow}>
          <Image source={{ uri: byte.author.avatar }} style={styles.avatar} />
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{byte.author.name}</Text>
            <Text style={styles.timestamp}>{byte.timestamp}</Text>
          </View>
        </View>
        <Text style={styles.contentText}>{byte.content}</Text>
        <View style={styles.tagsRow}>
          {byte.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.statsRow}>
          <Text style={styles.statText}>❤️ {byte.likes}</Text>
          <Text style={styles.statText}>💬 {byte.comments}</Text>
        </View>
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>Comments</Text>
          {byte.commentsList.map((comment) => (
            <View key={comment.id} style={styles.commentCard}>
              <Text style={styles.commentAuthor}>{comment.author}</Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <Text style={styles.commentTimestamp}>{comment.timestamp}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#0ea5e9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  timestamp: {
    fontSize: 12,
    color: '#94a3b8',
  },
  contentText: {
    fontSize: 18,
    color: '#1e293b',
    lineHeight: 26,
    marginBottom: 16,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#e0f2fe',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#0284c7',
    fontSize: 14,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  statText: {
    fontSize: 16,
    color: '#64748b',
    marginRight: 24,
  },
  commentsSection: {
    marginTop: 20,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 12,
  },
  commentCard: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0ea5e9',
    marginBottom: 4,
  },
  commentContent: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  commentTimestamp: {
    fontSize: 12,
    color: '#94a3b8',
  },
});

