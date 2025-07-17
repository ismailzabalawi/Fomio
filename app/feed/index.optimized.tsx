import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { 
  FlatList, 
  RefreshControl, 
  View, 
  Text, 
  StyleSheet,
  Animated,
  ListRenderItem,
  ViewToken,
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
import { 
  LazyImage,
  ProgressiveLoader,
  VirtualizedList,
  memoryOptimizer,
} from '../../shared/lazy-loading';
import { 
  performanceMonitor, 
  usePerformanceTracking,
  useMemoryLeakDetection,
  networkMonitor,
} from '../../shared/performance-monitor';
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
  imageUrl?: string; // Optional image for testing lazy loading
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
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=400&fit=crop',
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
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
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

// Memoized ByteCard component for optimal performance
const MemoizedByteCard = React.memo(ByteCardEnhanced);

/**
 * Performance-Optimized Feed Screen
 * 
 * Features:
 * - Advanced lazy loading for images and components
 * - Memory leak detection and prevention
 * - Performance monitoring and tracking
 * - Optimized FlatList with virtualization
 * - Progressive loading for non-critical content
 * - Network request optimization
 * - Memory usage optimization
 */
export default function FeedScreenOptimized() {
  const { isDark } = useTheme();
  const colors = getThemeColors(isDark);
  
  // Performance tracking
  usePerformanceTracking('FeedScreen');
  useMemoryLeakDetection('FeedScreen');
  
  // State management
  const [bytes, setBytes] = useState<Byte[]>(mockBytes);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<string[]>([]);
  
  // Animation refs
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  
  // Performance optimization: Track visible items for lazy loading
  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    const visible = viewableItems.map(item => item.item.id);
    setVisibleItems(visible);
  }, []);
  
  const viewabilityConfig = useMemo(() => ({
    itemVisiblePercentThreshold: 50,
    minimumViewTime: 100,
  }), []);
  
  // Optimized refresh handler with network monitoring
  const handleRefresh = useCallback(async () => {
    const startTime = performance.now();
    setRefreshing(true);
    setError(null);
    
    try {
      // Simulate API call with network monitoring
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const duration = performance.now() - startTime;
      networkMonitor.trackApiCall('/feed/refresh', 'GET', duration, true);
      
      // Add some new mock data
      const newByte: Byte = {
        id: Date.now().toString(),
        content: 'Fresh content from the optimized feed! This demonstrates lazy loading and performance monitoring.',
        teretId: 'updates',
        teretName: 'Updates',
        author: {
          name: 'Performance Bot',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
        },
        likes: 0,
        comments: 0,
        isLiked: false,
        isBookmarked: false,
        createdAt: new Date(),
        timestamp: 'now',
        tags: ['fresh', 'optimized'],
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=600&h=400&fit=crop',
      };
      
      setBytes(prev => [newByte, ...prev]);
    } catch (err) {
      const duration = performance.now() - startTime;
      networkMonitor.trackApiCall('/feed/refresh', 'GET', duration, false);
      setError('Failed to refresh feed. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, []);
  
  // Optimized action handlers with performance tracking
  const handleLike = useCallback((id: string) => {
    const startTime = performance.now();
    
    setBytes(prev => prev.map(byte => 
      byte.id === id 
        ? { 
            ...byte, 
            isLiked: !byte.isLiked,
            likes: byte.isLiked ? byte.likes - 1 : byte.likes + 1
          }
        : byte
    ));
    
    const duration = performance.now() - startTime;
    performanceMonitor.trackNetworkRequest('Like Action', duration, true);
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
    console.log('Navigate to teret:', teretId);
  }, []);
  
  // Enhanced render item with lazy loading and performance optimization
  const renderByte: ListRenderItem<Byte> = useCallback(({ item, index }) => {
    const isVisible = visibleItems.includes(item.id);
    
    return (
      <ProgressiveLoader priority={index < 3 ? 'high' : 'medium'} delay={index * 50}>
        <View style={styles.byteContainer}>
          <MemoizedByteCard
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
          />
          
          {/* Lazy-loaded image if present */}
          {item.imageUrl && (
            <ProgressiveLoader priority="low" delay={200}>
              <LazyImage
                source={{ uri: item.imageUrl }}
                style={styles.byteImage}
                placeholder={<View style={styles.imagePlaceholder} />}
                threshold={100}
                onLoad={() => {
                  networkMonitor.trackImageLoad(item.imageUrl!, performance.now(), true);
                }}
                onError={(error) => {
                  networkMonitor.trackImageLoad(item.imageUrl!, performance.now(), false);
                }}
              />
            </ProgressiveLoader>
          )}
        </View>
      </ProgressiveLoader>
    );
  }, [visibleItems, handleBytePress, handleLike, handleComment, handleBookmark, handleTeretPress]);
  
  // Optimized key extractor
  const keyExtractor = useCallback((item: Byte) => item.id, []);
  
  // Memory optimization effect
  useEffect(() => {
    const interval = setInterval(() => {
      memoryOptimizer.monitorMemoryUsage();
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(interval);
  }, []);
  
  // Optimized scroll handler
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
        <HeaderBar title="Optimized Feed" />
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
          maxToRenderPerBatch={3} // Reduced for better performance
          updateCellsBatchingPeriod={100} // Increased for smoother scrolling
          initialNumToRender={3} // Reduced initial render
          windowSize={5} // Reduced window size
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={(data, index) => ({
            length: 250, // Approximate item height including image
            offset: 250 * index,
            index,
          })}
          ListEmptyComponent={renderEmpty}
          accessible
          accessibilityLabel="Optimized feed of posts"
          accessibilityHint="Scroll to see more posts, pull down to refresh"
        />
      </LoadingStateEnhanced>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  byteContainer: {
    marginBottom: spacing.sm,
  },
  
  byteImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: spacing.sm,
    marginHorizontal: spacing.md,
  },
  
  imagePlaceholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginTop: spacing.sm,
    marginHorizontal: spacing.md,
  },
  
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

