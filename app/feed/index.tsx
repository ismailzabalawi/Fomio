import React, { useState, useCallback } from 'react';
import { FlatList, RefreshControl, View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ByteCard } from '../../components/feed';
import { HeaderBar } from '../../components/nav';
import { UserCircle } from 'phosphor-react-native';

interface Byte {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  tags: string[];
  timestamp: string;
}

const mockBytes: Byte[] = [
  {
    id: '1',
    content: 'Just discovered this amazing new feature! The possibilities are endless. #innovation #tech',
    author: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    likes: 42,
    comments: 8,
    tags: ['innovation', 'tech'],
    timestamp: '2h ago',
  },
  {
    id: '2',
    content: 'Sometimes the best code is the code you don\'t write. Keep it simple! #programming #simplicity',
    author: {
      name: 'Sarah Kim',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    likes: 28,
    comments: 5,
    tags: ['programming', 'simplicity'],
    timestamp: '4h ago',
  },
  {
    id: '3',
    content: 'Working on something exciting! Can\'t wait to share it with you all. Stay tuned! #excited #building',
    author: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    likes: 15,
    comments: 3,
    tags: ['excited', 'building'],
    timestamp: '6h ago',
  },
];

export default function FeedScreen() {
  const [bytes, setBytes] = useState<Byte[]>(mockBytes);
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleCompose = () => {
    router.push('/(compose)');
  };

  const handleProfile = () => {
    router.push('/(profile)');
  };

  const handleBytePress = (byteId: string) => {
    router.push({ pathname: '/feed/[byteId]', params: { byteId } });
  };

  const handleCommentPress = (byteId: string) => {
    router.push({ pathname: '/feed/[byteId]', params: { byteId, openComments: 'true' } });
  };

  const renderByte = ({ item }: { item: Byte }) => (
    <ByteCard
      id={item.id}
      content={item.content}
      author={item.author}
      likes={item.likes}
      comments={item.comments}
      tags={item.tags}
      timestamp={item.timestamp}
      onPress={handleBytePress}
      onLike={() => {}}
      onComment={handleCommentPress}
      style={{}}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <HeaderBar
        title="Feed"
        rightIcon={<UserCircle size={28} weight="bold" />}
        onRightPress={handleProfile}
        rightA11yLabel="Profile"
        style={{ marginBottom: 4 }}
      />

      <FlatList
        data={bytes}
        renderItem={renderByte}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedList}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleCompose}
        accessible
        accessibilityRole="button"
        accessibilityLabel="Create Byte"
        accessibilityHint="Opens the compose screen to create a new Byte"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0ea5e9',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 12,
    padding: 8,
  },
  headerButtonText: {
    fontSize: 20,
  },
  feedList: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: 'bold',
  },
});

