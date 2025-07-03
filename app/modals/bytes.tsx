import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { TabBarContext } from '../../contexts/TabBarContext';
import { useTheme } from '../../lib/theme/theme';
import { Heart, ChatCircle, Share, Bookmark, MoreHorizontal, Eye, Clock } from 'phosphor-react-native';
import { Avatar } from "@/components/ui/Avatar"
import { Container } from '../../components/ui/Container';
import HeaderBar from '../../components/ui/HeaderBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { useRouter } from 'expo-router';
import { Box, HStack, VStack, Pressable, Divider } from '@gluestack-ui/themed';

// Add imports at the top
import PostCard from '@/components/post-card/PostCard';
import { mapByteToPost } from '@/lib/mappers/mapByteToPost';

const { width: screenWidth } = Dimensions.get('window');

// Enhanced sample data for Byte screen
const bytesMock = [
  {
    id: '1',
    type: 'long',
    title: 'The Future of Mobile Design: Why UX Matters More Than Ever',
    content: 'User experience design is the process of building great products that provide meaningful and relevant experiences to users. This involves the design of the entire process of acquiring and integrating the product, including aspects of branding, design, usability, and function.',
    author: {
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786',
      verified: true,
    },
    stats: {
      views: 1247,
      likes: 89,
      comments: 23,
      timeAgo: '2h ago',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e',
      caption: 'UX Design in practice',
    },
    tags: ['Design', 'UX', 'Mobile'],
  },
  {
    id: '2',
    type: 'picture',
    title: 'Stunning Mountain View from My Morning Hike',
    author: {
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
      verified: false,
    },
    stats: {
      views: 892,
      likes: 156,
      comments: 12,
      timeAgo: '4h ago',
    },
    image: {
      url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
      caption: 'Captured during sunrise at 6:30 AM',
    },
    tags: ['Nature', 'Photography', 'Hiking'],
  },
  {
    id: '3',
    type: 'gallery',
    title: 'My Trip to Japan: A Visual Journey',
    author: {
      name: 'Maya Tanaka',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
      verified: true,
    },
    stats: {
      views: 2156,
      likes: 234,
      comments: 45,
      timeAgo: '1d ago',
    },
    images: [
      'https://images.unsplash.com/photo-1558981285-6f0c94958bb6',
      'https://images.unsplash.com/photo-1576085898323-218337e3e1f4',
      'https://images.unsplash.com/photo-1549692520-acc6669e2f0c',
    ],
    tags: ['Travel', 'Japan', 'Culture'],
  },
  {
    id: '4',
    type: 'video',
    title: 'Learn React Native in 10 Minutes: Quick Start Guide',
    author: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
      verified: true,
    },
    stats: {
      views: 3421,
      likes: 189,
      comments: 67,
      timeAgo: '3d ago',
    },
    videoUrl: 'https://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4',
    tags: ['Programming', 'React Native', 'Tutorial'],
  },
  {
    id: '5',
    type: 'poll',
    title: 'Which mobile OS do you prefer for development?',
    author: {
      name: 'Emma Wilson',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
      verified: false,
    },
    stats: {
      views: 567,
      likes: 34,
      comments: 89,
      timeAgo: '5h ago',
    },
    pollOptions: ['iOS', 'Android', 'Both', 'Neither'],
    tags: ['Development', 'Mobile', 'Survey'],
  },
];

export default function BytesModal() {
  const { theme } = useTheme();
  const { tabBarOffset } = React.useContext(TabBarContext);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Set<string>>(new Set());
  const router = useRouter();
  
  const insets = useSafeAreaInsets();
  const scrollY = useSharedValue(0);
  
  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          background: '#FFFFFF',
          cardBg: '#F8F9FA',
          text: '#1C1C1E',
          secondaryText: '#8E8E93',
          border: '#E5E5EA',
          heartActive: '#FF3B30',
          heartInactive: '#8E8E93',
          accent: '#007AFF',
          tagBg: '#F2F2F7',
        };
      case 'dark':
        return {
          background: '#000000',
          cardBg: '#1C1C1E',
          text: '#F2F2F2',
          secondaryText: '#8E8E93',
          border: '#2C2C2E',
          heartActive: '#FF453A',
          heartInactive: '#8E8E93',
          accent: '#0A84FF',
          tagBg: '#2C2C2E',
        };
      case 'reader':
        return {
          background: '#FAF4E6',
          cardBg: '#F5ECD7',
          text: '#2E2C28',
          secondaryText: '#6C6A67',
          border: '#D8CCAF',
          heartActive: '#C03A2B',
          heartInactive: '#6C6A67',
          accent: '#8B4513',
          tagBg: '#E8DCC0',
        };
      default:
        return {
          background: '#000000',
          cardBg: '#1C1C1E',
          text: '#F2F2F2',
          secondaryText: '#8E8E93',
          border: '#2C2C2E',
          heartActive: '#FF453A',
          heartInactive: '#8E8E93',
          accent: '#0A84FF',
          tagBg: '#2C2C2E',
        };
    }
  };
  
  const colors = getColors();
  
  const toggleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts);
    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };
  
  const toggleBookmark = (postId: string) => {
    const newBookmarkedPosts = new Set(bookmarkedPosts);
    if (newBookmarkedPosts.has(postId)) {
      newBookmarkedPosts.delete(postId);
    } else {
      newBookmarkedPosts.add(postId);
    }
    setBookmarkedPosts(newBookmarkedPosts);
  };

  const handleBackPress = () => {
    router.push('/(tabs)/home');
  };
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
      tabBarOffset.value = event.contentOffset.y;
    },
  });

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  const renderPostHeader = (byte: any) => (
    <Box className="px-4 py-3">
      <HStack space="sm" alignItems="center" className="mb-3">
        <Avatar
          size="sm"
          source={{ uri: byte.author.avatar }}
          fallbackText={byte.author.name.charAt(0)}
        />
        <VStack flex={1}>
          <HStack space="xs" alignItems="center">
            <Text className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              {byte.author.name}
            </Text>
            {byte.author.verified && (
              <Text className="text-blue-500 text-xs">✓</Text>
            )}
          </HStack>
          <HStack space="xs" alignItems="center">
            <Clock size={12} color={colors.secondaryText} />
            <Text className="text-xs text-zinc-500 dark:text-zinc-400">
              {byte.stats.timeAgo}
            </Text>
          </HStack>
        </VStack>
        <Pressable className="p-2">
          <MoreHorizontal size={20} color={colors.secondaryText} />
        </Pressable>
      </HStack>
      
      <Text className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-2 leading-6">
        {byte.title}
      </Text>
      
      {byte.content && (
        <Text className="text-sm text-zinc-600 dark:text-zinc-300 mb-3 leading-5">
          {byte.content}
        </Text>
      )}
      
      {byte.tags && byte.tags.length > 0 && (
        <HStack space="xs" className="mb-3">
          {byte.tags.map((tag: string, index: number) => (
            <Box
              key={index}
              className="px-2 py-1 rounded-full"
              style={{ backgroundColor: colors.tagBg }}
            >
              <Text className="text-xs text-zinc-600 dark:text-zinc-300">
                #{tag}
              </Text>
            </Box>
          ))}
        </HStack>
      )}
    </Box>
  );

  const renderPostActions = (byte: any) => (
    <Box className="px-4 py-3">
      <HStack space="lg" alignItems="center" justifyContent="space-between">
        <HStack space="md" alignItems="center">
          <Pressable
            onPress={() => toggleLike(byte.id)}
            className="flex-row items-center space-x-1"
          >
            <Heart
              size={20}
              color={likedPosts.has(byte.id) ? colors.heartActive : colors.heartInactive}
              weight={likedPosts.has(byte.id) ? 'fill' : 'regular'}
            />
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">
              {formatNumber(byte.stats.likes)}
            </Text>
          </Pressable>
          
          <Pressable className="flex-row items-center space-x-1">
            <ChatCircle size={20} color={colors.secondaryText} />
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">
              {formatNumber(byte.stats.comments)}
            </Text>
          </Pressable>
          
          <Pressable className="flex-row items-center space-x-1">
            <Eye size={20} color={colors.secondaryText} />
            <Text className="text-sm text-zinc-600 dark:text-zinc-300">
              {formatNumber(byte.stats.views)}
            </Text>
          </Pressable>
        </HStack>
        
        <HStack space="sm">
          <Pressable
            onPress={() => toggleBookmark(byte.id)}
            className="p-2"
          >
            <Bookmark
              size={20}
              color={bookmarkedPosts.has(byte.id) ? colors.accent : colors.secondaryText}
              weight={bookmarkedPosts.has(byte.id) ? 'fill' : 'regular'}
            />
          </Pressable>
          
          <Pressable className="p-2">
            <Share size={20} color={colors.secondaryText} />
          </Pressable>
        </HStack>
      </HStack>
    </Box>
  );
  
  return (
    <ScreenWrapper>
      <HeaderBar 
        title="Bytes"
        showBackButton={true}
        showProfileButton={false}
        onBackPress={handleBackPress}
      />
      <Animated.ScrollView
        style={[styles.scrollView, { backgroundColor: colors.background }]}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: 80, // Account for header
          paddingBottom: insets.bottom + 20,
        }}
      >
        <Container>
          <VStack space="md">
            {bytesMock.map((byte, index) => (
              <Box
                key={byte.id}
                className="rounded-2xl overflow-hidden"
                style={{ backgroundColor: colors.cardBg }}
              >
                {renderPostHeader(byte)}
                
                <PostCard post={mapByteToPost(byte)} />
                
                {renderPostActions(byte)}
                
                {index < bytesMock.length - 1 && (
                  <Divider
                    className="mx-4"
                    style={{ backgroundColor: colors.border }}
                  />
                )}
              </Box>
            ))}
          </VStack>
        </Container>
      </Animated.ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
});
