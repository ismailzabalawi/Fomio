import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../components/shared/theme-provider';
import { ByteCard } from '../../components/feed/ByteCard';
import { HeaderBar } from '../../components/nav/HeaderBar';

interface FeedItem {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  timestamp: string;
  teretName: string;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

const mockFeedData: FeedItem[] = [
  {
    id: '1',
    title: 'Getting Started with React Native',
    content: 'Just published my first React Native app! The development experience is amazing. The hot reload feature alone makes development so much faster. Can\'t wait to share more about the journey.',
    author: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    timestamp: '2h ago',
    teretName: 'React Native',
    likes: 42,
    comments: 8,
    isLiked: false,
    isBookmarked: false,
  },
  {
    id: '2',
    title: 'UI/UX Design Tips',
    content: 'Remember: good design is invisible. Focus on user needs, not just aesthetics. The best interfaces disappear in use and make users feel smart.',
    author: {
      name: 'Sarah Kim',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    timestamp: '4h ago',
    teretName: 'Design',
    likes: 28,
    comments: 5,
    isLiked: true,
    isBookmarked: true,
  },
  {
    id: '3',
    title: 'Building Scalable Apps',
    content: 'Architecture matters more than you think. Plan for scale from day one. Clean code, proper separation of concerns, and thoughtful data structures will save you countless hours later.',
    author: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    timestamp: '6h ago',
    teretName: 'Architecture',
    likes: 15,
    comments: 3,
    isLiked: false,
    isBookmarked: false,
  },
];

export default function HomeScreen(): JSX.Element {
  const { isDark, isAmoled } = useTheme();
  
  const colors = {
    background: isAmoled ? '#000000' : (isDark ? '#18181b' : '#ffffff'),
    text: isDark ? '#f4f4f5' : '#1e293b',
    secondary: isDark ? '#a1a1aa' : '#64748b',
    border: isDark ? '#334155' : '#e2e8f0',
  };

  const handleLike = (id: string): void => {
    console.log('Like pressed for:', id);
  };

  const handleComment = (id: string): void => {
    console.log('Comment pressed for:', id);
  };

  const handleBookmark = (id: string): void => {
    console.log('Bookmark pressed for:', id);
  };

  const handleShare = (id: string): void => {
    console.log('Share pressed for:', id);
  };

  const handleMore = (id: string): void => {
    console.log('More pressed for:', id);
  };

  const handleBytePress = (byteId: string): void => {
    console.log('Navigating to byte:', byteId);
    router.push(`/feed/${byteId}`);
  };

  const handleTeretPress = (teretName: string): void => {
    console.log('Teret pressed:', teretName);
  };

  const renderFeedItem = ({ item }: { item: FeedItem }): JSX.Element => (
    <ByteCard
      id={item.id}
      content={item.content}
      teretName={item.teretName}
      author={item.author}
      likes={item.likes}
      comments={item.comments}
      timestamp={item.timestamp}
      isLiked={item.isLiked}
      isBookmarked={item.isBookmarked}
      onPress={() => handleBytePress(item.id)}
      onLike={() => handleLike(item.id)}
      onComment={() => handleComment(item.id)}
      onBookmark={() => handleBookmark(item.id)}
      onShare={() => handleShare(item.id)}
      onMore={() => handleMore(item.id)}
      onTeretPress={() => handleTeretPress(item.teretName)}
    />
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar 
        title="Feed" 
        showBackButton={false}
        showProfileButton={true}
      />
      
      <FlatList
        data={mockFeedData}
        renderItem={renderFeedItem}
        keyExtractor={(item) => item.id}
        style={styles.feedList}
        contentContainerStyle={styles.feedContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  feedList: {
    flex: 1,
  },
  feedContent: {
    paddingVertical: 8,
  },
}); 