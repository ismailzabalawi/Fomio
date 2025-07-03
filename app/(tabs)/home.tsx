import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import PostCard from '@/components/post-card/PostCard';
import { mapByteToPost } from '@/lib/mappers/mapByteToPost';
import { FlatList } from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import { Pressable, Avatar } from '@gluestack-ui/themed';
import { Container } from '../../components/ui/Container';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBarContext } from './_layout';
import Animated, { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';
import { 
  HomeIcon, 
  ChatIcon, 
  NotificationIcon,
  // Add other specific icons you need
} from '@/components/icons';

// Or import PhosphorIcon for any other icons
import { PhosphorIcon } from '@/components/PhosphorIcon';

// Sample data for Home screen
const feedFilters = [
  { id: '1', name: 'Latest', active: true },
  { id: '2', name: 'Hot', active: false },
  { id: '3', name: 'Categories', active: false },
];

const followingPosts = [
  {
    id: '1',
    author: 'Mansurul Haque',
    authorAvatar: '👤',
    date: '8/18/2021',
    topic: 'Why You Need UX In Design?',
    title: 'Why UX Design Is More Important Then UI Design.',
    snippet: 'Why You Need UX In Design?\n\nAs a founder of UI HUT i discover....',
    readTime: '5 min',
    type: 'long',
    content: 'Why You Need UX In Design?\n\nAs a founder of UI HUT i discover....',
  },
  {
    id: '2',
    author: 'Wahab Khan',
    authorAvatar: '👤',
    date: '8/18/2021',
    topic: 'Business In Design & Text',
    title: 'Revealing The Uniqueness Of Your Business In Design & Text',
    snippet: 'Why I Need Uniqueness Of Your Business?\n\nI just discover that we all need....',
    readTime: '10 min',
    type: 'long',
    content: 'Why I Need Uniqueness Of Your Business?\n\nI just discover that we all need....',
  },
  {
    id: '3',
    author: 'Ahnaf Irfan',
    authorAvatar: '👤',
    date: '8/18/2021',
    topic: 'Improve Your Visual Design',
    title: 'How To Make Your Visual Design Better!',
    snippet: 'Why You Need Visual Design?\n\nAs a visual designer i experience that....',
    readTime: '7 min',
    type: 'long',
    content: 'Why You Need Visual Design?\n\nAs a visual designer i experience that....',
  },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const { tabBarOffset } = React.useContext(TabBarContext);
  const [selectedFeed, setSelectedFeed] = useState('Latest');
  
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      tabBarOffset.value = event.contentOffset.y;
    },
  });
  
  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          text: '#1C1C1E',
          secondaryText: '#8E8E93',
          categoryBg: '#F2F2F7',
          categoryActiveBg: '#FFEB3B',
          categoryActiveText: '#000000',
          divider: '#E5E5EA',
          cardBg: '#FFFFFF',
        };
      case 'dark':
        return {
          text: '#F2F2F2',
          secondaryText: '#8E8E93',
          categoryBg: '#1C1C1E',
          categoryActiveBg: '#FFEB3B',
          categoryActiveText: '#000000',
          divider: '#2C2C2E',
          cardBg: '#1C1C1E',
        };
      case 'reader':
        return {
          text: '#2E2C28',
          secondaryText: '#6C6A67',
          categoryBg: '#E5DBC0',
          categoryActiveBg: '#D8CCAF',
          categoryActiveText: '#2E2C28',
          divider: '#D8CCAF',
          cardBg: '#F5ECD7',
        };
      default:
        return {
          text: '#F2F2F2',
          secondaryText: '#8E8E93',
          categoryBg: '#1C1C1E',
          categoryActiveBg: '#FFEB3B',
          categoryActiveText: '#000000',
          divider: '#2C2C2E',
          cardBg: '#1C1C1E',
        };
    }
  };
  
  const colors = getColors();
  const insets = useSafeAreaInsets();
  
  // Placeholder for image assets
  const getImagePlaceholder = (imageId: string) => {
    if (imageId === 'uber') {
      return (
        <View style={[styles.trendingImage, { backgroundColor: '#000000' }]}>
          <Text style={styles.trendingImageText}>Uber</Text>
        </View>
      );
    } else if (imageId === 'community') {
      return (
        <View style={[styles.trendingImage, { backgroundColor: '#4A90E2' }]}>
          <Text style={styles.trendingImageText}>👥</Text>
        </View>
      );
    }
    return null;
  };
  
  return (
    <ScreenWrapper>
      <Animated.ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: 128,
          paddingBottom: 16,
        }}
      >
        <Container style={{ paddingBottom: 16 }}>
          {/* Title */}
          <Text style={[styles.title, { color: colors.text }]}>
            Home Feed
          </Text>
          
          {/* Feed Filters */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {feedFilters.map((feed) => (
              <TouchableOpacity
                key={feed.id}
                style={[
                  styles.categoryButton,
                  { 
                    backgroundColor: selectedFeed === feed.name ? colors.categoryActiveBg : colors.categoryBg
                  }
                ]}
                onPress={() => setSelectedFeed(feed.name)}
              >
                <Text 
                  style={[
                    styles.categoryText,
                    { 
                      color: selectedFeed === feed.name ? colors.categoryActiveText : colors.text
                    }
                  ]}
                >
                  {feed.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          {/* Feed Content based on selection */}
          {selectedFeed === 'Latest' && (
            <View>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  LATEST POSTS
                </Text>
                <TouchableOpacity style={styles.sortButton}>
                  <Text style={[styles.sortText, { color: colors.secondaryText }]}>
                    Sort By
                  </Text>
                  <Text style={[styles.sortIcon, { color: colors.secondaryText }]}>
                    ≡
                  </Text>
                </TouchableOpacity>
              </View>
              <FlatList
                data={followingPosts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View className="mb-6">
                    <PostCard post={mapByteToPost(item)} />
                  </View>
                )}
                scrollEnabled={false}
                contentContainerStyle={{ paddingBottom: 16 }}
              />
            </View>
          )}

          {selectedFeed === 'Hot' && (
            // Hot feed content
            <View>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  TRENDING NOW
                </Text>
              </View>
              {/* Render hot/trending posts */}
              {followingPosts.slice(0, 2).map((post) => (
                <TouchableOpacity key={post.id} style={styles.postCard}>
                  <View style={styles.postHeader}>
                    <View style={styles.authorContainer}>
                      <Avatar size="sm" borderRadius="$full" bgColor="$coolGray600">
                        <Avatar.FallbackText>{post.author[0]}</Avatar.FallbackText>
                      </Avatar>
                      <View style={styles.postMeta}>
                        <Text style={[styles.authorName, { color: colors.text }]}>
                          {post.author}
                        </Text>
                        <Text style={[styles.postDate, { color: colors.secondaryText }]}>
                          Date : {post.date}
                        </Text>
                        <Text style={[styles.postTopic, { color: colors.secondaryText }]}>
                          Topic : {post.topic}
                        </Text>
                      </View>
                    </View>
                  </View>
                  
                  <Text style={[styles.postTitle, { color: colors.text }]}>
                    {post.title}
                  </Text>
                  
                  <Text style={[styles.postSnippet, { color: colors.secondaryText }]}>
                    {post.snippet}
                  </Text>
                  
                  <View style={styles.postFooter}>
                    <Text style={[styles.readTime, { color: '#4CAF50' }]}>
                      Read Time : {post.readTime}
                    </Text>
                    <TouchableOpacity style={styles.bookmarkButton}>
                      <Text style={{ fontSize: 18 }}>🔖</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {selectedFeed === 'Categories' && (
            // Categories feed content
            <View>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  BROWSE CATEGORIES
                </Text>
              </View>
              {/* Add category grid or list here */}
              <View style={styles.categoriesGrid}>
                {['Design', 'Development', 'Marketing', 'Business', 'Technology', 'Lifestyle'].map((category) => (
                  <TouchableOpacity 
                    key={category}
                    style={[styles.categoryCard, { backgroundColor: colors.cardBg }]}
                  >
                    <Text style={[styles.categoryCardText, { color: colors.text }]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
          
        </Container>
      </Animated.ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  categoriesContainer: {
    marginBottom: 24,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: 14,
    marginRight: 4,
  },
  sortIcon: {
    fontSize: 16,
  },
  postCard: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  postMeta: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  postDate: {
    fontSize: 12,
    marginBottom: 2,
  },
  postTopic: {
    fontSize: 12,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 24,
  },
  postSnippet: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  postFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  readTime: {
    fontSize: 14,
  },
  bookmarkButton: {
    padding: 4,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  trendingSection: {
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#1C1C1E',
  },
  trendingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  trendingCard: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  trendingImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trendingImageText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  trendingContent: {
    flex: 1,
  },
  trendingAuthor: {
    fontSize: 14,
    marginBottom: 4,
  },
  trendingPostTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 22,
  },
  trendingSnippet: {
    fontSize: 14,
    marginBottom: 4,
  },
  trendingReadTime: {
    fontSize: 14,
  },
  bottomPadding: {
    height: 80,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryCard: {
    width: '47%', // Slightly less than half to account for gap
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
  },
  categoryCardText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
