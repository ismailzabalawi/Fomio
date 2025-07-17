import React, { useState, useCallback, useMemo, useRef } from 'react';
import { 
  FlatList, 
  RefreshControl, 
  View, 
  Text, 
  StyleSheet,
  Animated,
  ListRenderItem,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ByteCardEnhanced } from '../../components/feed/ByteCard.enhanced';
import { HeaderBar } from '../../components/nav';
import { 
  LoadingStateEnhanced, 
  PostSkeletonEnhanced,
  PullToRefreshIndicator,
} from '../../components/shared/loading.enhanced';
import { useTheme } from '../../components/shared/theme-provider';
import { 
  spacing, 
  getThemeColors,
  createTextStyle,
  animation,
} from '@/shared/design-system';

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
  teretId: string;
  teretName: string;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: Date;
}

const mockBytes: Byte[] = [
  {
    id: '1',
    content: 'Just discovered this amazing new feature! The possibilities are endless. This is going to change everything about how we approach mobile development.',
    teretId: 'react-native',
    teretName: 'React Native',
    author: {
      name: 'Alex Chen',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    likes: 42,
    comments: 8,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(),
    timestamp: '2h ago',
    tags: ['innovation', 'tech'],
  },
  {
    id: '2',
    content: 'Sometimes the best code is the code you don\'t write. Keep it simple, keep it clean, and always think about maintainability.',
    teretId: 'programming',
    teretName: 'Programming',
    author: {
      name: 'Sarah Kim',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    likes: 127,
    comments: 23,
    isLiked: true,
    isBookmarked: true,
    createdAt: new Date(),
    timestamp: '4h ago',
    tags: ['coding', 'philosophy'],
  },
  {
    id: '3',
    content: 'Working on a new design system for our mobile app. The attention to detail in micro-interactions really makes a difference in user experience.',
    teretId: 'design',
    teretName: 'Design',
    author: {
      name: 'Mike Johnson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    likes: 89,
    comments: 15,
    isLiked: false,
    isBookmarked: false,
    createdAt: new Date(),
    timestamp: '6h ago',
    tags: ['design', 'ux'],
  },
  {
    id: '4',
    content: 'Performance optimization tip: Always measure before you optimize. Profile your app, find the real bottlenecks, then fix them systematically.',
    teretId: 'performance',
    teretName: 'Performance',
    author: {
      name: 'Emma Davis',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    likes: 156,
    comments: 31,
    isLiked: true,
    isBookmarked: false,
    createdAt: new Date(),
    timestamp: '8h ago',
    tags: ['performance', 'optimization'],
  },
];

/**
 * Enhanced Feed Screen
 * 
 * Features:
 * - Pull-to-refresh with smooth animations
 * - Optimized FlatList rendering
 * - Skeleton loading states
 * - Memoized components for performance
 * - Enhanced error handling
 * - Smooth scroll animations
 * - Accessibility improvements
 */
export default function FeedScreenEnhanced() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  
  // State management
  const [bytes, setBytes] = useState<Byte[]>(mockBytes);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  
  // Memoized callbacks for performance
  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Add some new mock data
      const newByte: Byte = {
        id: Date.now().toString(),
        content: 'Fresh content from the feed! This is a new byte that was just loaded.',
        teretId: 'updates',
        teretName: 'Updates',
        author: {
          name: 'Feed Bot',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        },
        likes: 0,
        comments: 0,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(),
        timestamp: 'now',
        tags: ['fresh'],
      };
      
      setBytes(prev => [newByte, ...prev]);
    } catch (err) {
      setError('Failed to refresh feed. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, []);
  
  const handleLike = useCallback((id: string) => {
    setBytes(prev => prev.map(byte => 
      byte.id === id 
        ? { 
            ...byte, 
            isLiked: !byte.isLiked,
            likes: byte.isLiked ? byte.likes - 1 : byte.likes + 1
          }
        : byte
    ));
  }, []);
  
  const handleBookmark = useCallback((id: string) => {
    setBytes(prev => prev.map(byte => 
      byte.id === id 
        ? { ...byte, isBookmarked: !byte.isBookmarked }
        : byte
    ));
  }, []);
  
  const handleComment = useCallback((id: string) => {
    router.push(`/feed/${id}`);
  }, []);
  
  const handleBytePress = useCallback((id: string) => {
    router.push(`/feed/${id}`);
  }, []);
  
  const handleTeretPress = useCallback((teretId: string) => {
    // Navigate to teret page
    console.log('Navigate to teret:', teretId);
  }, []);
  
  // Memoized render item for performance
  const renderByte: ListRenderItem<Byte> = useCallback(({ item, index }) => (
    <ByteCardEnhanced
      key={item.id}
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
      onTeretPress={() => handleTeretPress(item.teretId)}
      style={{
        // Stagger animation for initial load
        opacity: loading ? 0 : 1,
        transform: [{
          translateY: loading ? 50 : 0
        }]
      }}
    />
  ), [handleBytePress, handleLike, handleComment, handleBookmark, handleTeretPress, loading]);
  
  // Memoized key extractor
  const keyExtractor = useCallback((item: Byte) => item.id, []);
  
  // Memoized empty component
  const renderEmpty = useCallback(() => (
    <View style={styles.emptyContainer}>
      <Text style={[
        createTextStyle('title', colors.textSecondary),
        styles.emptyTitle,
      ]}>
        No bytes yet
      </Text>
      <Text style={[
        createTextStyle('body', colors.textTertiary),
        styles.emptyMessage,
      ]}>
        Pull down to refresh or check back later for new content.
      </Text>
    </View>
  ), [colors]);
  
  // Memoized loading component
  const renderLoading = useCallback(() => (
    <View style={styles.loadingContainer}>
      {Array.from({ length: 3 }).map((_, index) => (
        <PostSkeletonEnhanced key={index} />
      ))}
    </View>
  ), []);
  
  // Handle scroll for header animation
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { 
      useNativeDriver: false,
      listener: (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        const opacity = offsetY > 50 ? 0.9 : 1;
        
        Animated.timing(headerOpacity, {
          toValue: opacity,
          duration: animation.duration.fast,
          useNativeDriver: true,
        }).start();
      }
    }
  );
  
  // Memoized refresh control
  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      tintColor={colors.primary}
      colors={[colors.primary]}
      progressBackgroundColor={colors.surface}
      title="Pull to refresh"
      titleColor={colors.textSecondary}
    />
  ), [refreshing, handleRefresh, colors]);
  
  // Dynamic styles
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    
    header: {
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    
    list: {
      flex: 1,
    },
    
    listContent: {
      paddingBottom: spacing.xl,
    },
  });
  
  return (
    <SafeAreaView style={dynamicStyles.container}>
      {/* Animated Header */}
      <Animated.View style={[
        dynamicStyles.header,
        { opacity: headerOpacity }
      ]}>
        <HeaderBar title="Feed" />
      </Animated.View>
      
      {/* Main Content */}
      <LoadingStateEnhanced
        loading={loading && !refreshing}
        error={error}
        onRetry={() => {
          setError(null);
          setLoading(true);
          setTimeout(() => setLoading(false), 1000);
        }}
        loadingComponent={renderLoading()}
      >
        <FlatList
          style={dynamicStyles.list}
          contentContainerStyle={dynamicStyles.listContent}
          data={bytes}
          renderItem={renderByte}
          keyExtractor={keyExtractor}
          refreshControl={refreshControl}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          updateCellsBatchingPeriod={50}
          initialNumToRender={5}
          windowSize={10}
          getItemLayout={(data, index) => ({
            length: 200, // Approximate item height
            offset: 200 * index,
            index,
          })}
          ListEmptyComponent={renderEmpty}
          accessible
          accessibilityLabel="Feed of posts"
          accessibilityHint="Scroll to see more posts, pull down to refresh"
        />
      </LoadingStateEnhanced>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
    minHeight: 300,
  },
  
  emptyTitle: {
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  
  emptyMessage: {
    textAlign: 'center',
    lineHeight: 24,
  },
  
  loadingContainer: {
    flex: 1,
  },
});

