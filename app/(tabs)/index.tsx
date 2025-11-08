import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  TextInput,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../components/shared/theme-provider';
import { ByteCard } from '../../components/feed/ByteCard';
import { HeaderBar } from '../../components/nav/HeaderBar';
import { useFeed } from '../../hooks/useFeed';
import { useBffCategories } from '../../hooks/useBffCategories';
import { useSearch } from '../../hooks';
import { useAuth } from '../../lib/auth';
import { getSession, getLatest, DiscourseLatestResponse, DiscourseSession } from '../../lib/discourse';
import { useState, useEffect } from 'react';

// Helper function to format relative time
function formatRelativeTime(dateString: string): string {
  if (!dateString) return 'recently';

  const now = new Date();
  const date = new Date(dateString);

  // Check if date is valid
  if (isNaN(date.getTime())) return 'recently';

  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `${months} month${months > 1 ? 's' : ''} ago`;
  } else {
    const years = Math.floor(diffInSeconds / 31536000);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
}

// Feed data now comes from React Query hooks

export default function HomeScreen(): JSX.Element {
  const { isDark, isAmoled } = useTheme();

  // Apollo GraphQL hooks
  const {
    topics,
    loading: loading,
    error,
    refresh: refresh,
    loadMore,
    hasNextPage,
    isEmpty,
  } = useFeed();
  const { data: categoriesData } = useBffCategories();
  const { authed, user } = useAuth();
  const [session, setSession] = useState<DiscourseSession | null>(null);
  const [latestData, setLatestData] = useState<DiscourseLatestResponse | null>(null);

  // Load session and latest data when authenticated
  useEffect(() => {
    if (authed) {
      Promise.all([getSession(), getLatest()])
        .then(([sessionData, latest]) => {
          setSession(sessionData);
          setLatestData(latest);
        })
        .catch((error) => {
          console.error('Failed to load session/latest:', error);
        });
    }
  }, [authed]);

  // Search functionality - manage query state locally
  const [query, setQuery] = useState('');
  const searchQueryResult = useSearch(query);
  const searchResults = Array.isArray(searchQueryResult.data) ? searchQueryResult.data : [];
  const isSearching = searchQueryResult.isLoading || false;
  const hasResults = searchResults.length > 0;
  const filteredCategories: any[] = []; // Not used in current implementation

  // Scroll animation state
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchBarHeight = 68; // Height of search container + padding
  const [isSearchVisible, setIsSearchVisible] = useState(true);
  const animatedOpacity = useRef(new Animated.Value(1)).current;
  const animatedTranslateY = useRef(new Animated.Value(0)).current;

  // Initialize animations with a subtle bounce effect
  React.useEffect(() => {
    // Start with a slight scale animation for a polished feel
    Animated.sequence([
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 200,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Create a map of category IDs to names
  const categoryMap = new Map();
  if (categoriesData?.categories) {
    categoriesData.categories.forEach((cat: any) => {
      categoryMap.set(cat.id, cat.name);
    });
  }

  const colors = {
    background: isAmoled ? '#000000' : isDark ? '#18181b' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1e293b',
    secondary: isDark ? '#a1a1aa' : '#64748b',
    primary: isDark ? '#3b82f6' : '#0ea5e9',
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

  // Handle scroll events for search bar visibility
  const lastScrollY = useRef(0);
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const previousScrollY = lastScrollY.current;

    // Show search bar when scrolling up or at top, hide when scrolling down
    if (currentScrollY <= 0) {
      // Always show at top
      if (!isSearchVisible) {
        setIsSearchVisible(true);
        // Smooth fade in and slide down
        Animated.parallel([
          Animated.timing(animatedOpacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(animatedTranslateY, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      }
    } else if (currentScrollY > previousScrollY && currentScrollY > 50) {
      // Hide when scrolling down (with threshold to avoid flickering)
      if (isSearchVisible) {
        // Smooth fade out and slide up
        Animated.parallel([
          Animated.timing(animatedOpacity, {
            toValue: 0,
            duration: 250,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(animatedTranslateY, {
            toValue: -searchBarHeight,
            duration: 250,
            easing: Easing.in(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start(() => {
          setIsSearchVisible(false);
        });
      }
    } else if (currentScrollY < previousScrollY) {
      // Show when scrolling up
      if (!isSearchVisible) {
        setIsSearchVisible(true);
        // Smooth fade in and slide down
        Animated.parallel([
          Animated.timing(animatedOpacity, {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(animatedTranslateY, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ]).start();
      }
    }

    lastScrollY.current = currentScrollY;
    scrollY.setValue(currentScrollY);
  };

  // Show loading state
  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <HeaderBar title="Home" showProfileButton={true} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.secondary} />
          <Text style={[styles.loadingText, { color: colors.secondary }]}>
            Loading feed...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <HeaderBar title="Home" showProfileButton={true} />
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: '#ef4444' }]}>
            Failed to load feed
          </Text>
          <Text style={[styles.errorSubtext, { color: colors.secondary }]}>
            {error.message}
          </Text>
          <TouchableOpacity onPress={() => refresh()}>
            <Text style={[styles.retryText, { color: colors.primary }]}>
              Tap to retry
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleBytePress = (byteId: string): void => {
    console.log('Navigating to byte:', byteId);
    router.push(`/feed/${byteId}`);
  };

  const handleTeretPress = (teretName: string): void => {
    console.log('Teret pressed:', teretName);
  };

  const handleAuthorPress = (authorName: string): void => {
    console.log('Author pressed:', authorName);
    // TODO: Navigate to author profile
    // router.push(`/profile/${authorName}`);
  };

  // Feed items are now rendered inline in the FlatList

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <HeaderBar title="Feed" showBackButton={false} showProfileButton={true} />
      
      {/* Auth banner if not authenticated */}
      {!authed && (
        <View style={[styles.authBanner, { backgroundColor: colors.primary }]}>
          <Text style={styles.authBannerText}>
            Please sign in to view your feed
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/signin')}
            style={styles.authBannerButton}
          >
            <Text style={styles.authBannerButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Conditional Search Input - Completely removed from layout when hidden */}
      {isSearchVisible && (
        <Animated.View
          style={[
            styles.searchContainer,
            {
              backgroundColor: colors.background,
              opacity: animatedOpacity,
              transform: [
                {
                  translateY: animatedTranslateY,
                },
              ],
            },
          ]}
        >
          <TextInput
            style={[
              styles.searchInput,
              {
                backgroundColor: colors.border,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
            placeholder="Search Bytes, Terets, or Users..."
            placeholderTextColor={colors.secondary}
            value={query}
            onChangeText={setQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {isSearching && (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={styles.searchSpinner}
            />
          )}
        </Animated.View>
      )}

      {/* Search Results or Feed */}
      {query.length > 0 && query.length >= 3 ? (
        // Show search results
        <>
          {/* Search Results Header */}
          <View
            style={[
              styles.searchResultsHeader,
              {
                backgroundColor: colors.background,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.searchResultsTitle, { color: colors.text }]}>
              Search Results
            </Text>
            <Text
              style={[
                styles.searchResultsSubtitle,
                { color: colors.secondary },
              ]}
            >
              {isSearching
                ? 'Searching...'
                : `${(searchResults || []).length} results for "${query}"`}
            </Text>
          </View>

          <FlatList
            data={searchResults}
            renderItem={({ item }) => {
              // For search results, we have Post objects from Discourse search API
              // The search API returns different structure - it has 'blurb' for content
              // and we need to fetch topic title separately using topic_id
              const searchItem = item as any;

              // Use blurb for content (this is what the search API actually returns)
              const content = searchItem.blurb || 'No content available';
              const cleanContent =
                content.replace(/<[^>]*>/g, '').substring(0, 150) + '...';

              // Use the enriched topic title if available, otherwise fallback to post number
              const title =
                searchItem.topic_title || `Post #${searchItem.post_number}`;

              return (
                <ByteCard
                  id={(searchItem.topic_id || searchItem.id || 0).toString()}
                  title={title}
                  content={cleanContent}
                  teretName={
                    categoryMap.get(searchItem.category_id || 0) || 'General'
                  }
                  author={{
                    name:
                      searchItem.username ||
                      searchItem.display_username ||
                      'Anonymous',
                    avatar: searchItem.avatar_template
                      ? `https://meta.techrebels.info${searchItem.avatar_template.replace('{size}', '150')}`
                      : 'https://meta.techrebels.info/assets/default-avatar.png',
                  }}
                  likes={0}
                  comments={0}
                  timestamp={formatRelativeTime(
                    searchItem.created_at || new Date().toISOString()
                  )}
                  isLiked={false}
                  isBookmarked={false}
                  onPress={() =>
                    handleBytePress(
                      (searchItem.topic_id || searchItem.id || 0).toString()
                    )
                  }
                  onLike={() =>
                    handleLike(
                      (searchItem.topic_id || searchItem.id || 0).toString()
                    )
                  }
                  onComment={() =>
                    handleComment(
                      (searchItem.topic_id || searchItem.id || 0).toString()
                    )
                  }
                  onBookmark={() =>
                    handleBookmark(
                      (searchItem.topic_id || searchItem.id || 0).toString()
                    )
                  }
                  onShare={() =>
                    handleShare(
                      (searchItem.topic_id || searchItem.id || 0).toString()
                    )
                  }
                  onMore={() =>
                    handleMore(
                      (searchItem.topic_id || searchItem.id || 0).toString()
                    )
                  }
                  onTeretPress={() =>
                    handleTeretPress(
                      categoryMap.get(searchItem.category_id || 0) || 'General'
                    )
                  }
                  onAuthorPress={() =>
                    handleAuthorPress(
                      searchItem.username ||
                        searchItem.display_username ||
                        'Anonymous'
                    )
                  }
                />
              );
            }}
            keyExtractor={(item) => (item.id || item.topic_id || 0).toString()}
            style={styles.feedList}
            contentContainerStyle={styles.feedContent}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              !isSearching ? (
                <View style={styles.emptySearchContainer}>
                  <Text
                    style={[
                      styles.emptySearchText,
                      { color: colors.secondary },
                    ]}
                  >
                    No results found for "{query}"
                  </Text>
                  <Text
                    style={[
                      styles.emptySearchSubtext,
                      { color: colors.secondary },
                    ]}
                  >
                    Try different keywords or browse the feed instead
                  </Text>
                </View>
              ) : null
            }
          />
        </>
      ) : query.length > 0 ? (
        // Show "type more" message
        <View style={styles.emptySearchContainer}>
          <Text style={[styles.emptySearchText, { color: colors.secondary }]}>
            Type at least 3 characters to search
          </Text>
          <Text
            style={[styles.emptySearchSubtext, { color: colors.secondary }]}
          >
            Search through Bytes, Terets, and Users
          </Text>
        </View>
      ) : (
        // Show regular feed
        <FlatList
          data={topics || []}
          renderItem={({ item }) => {
            if (!item) return null;

            const itemId = item.id;
            const itemTitle = item.title;
            const posterUsername = item.author.username;
            const avatarUrl = item.author.avatar || '';
            const postsCount = item.postsCount;
            const itemCreatedAt = item.createdAt;

            return (
              <ByteCard
                id={itemId}
                title={itemTitle}
                content={item.excerpt || 'No content available'}
                teretName={item.category.name}
                author={{
                  name: posterUsername,
                  avatar: avatarUrl,
                }}
                likes={item.likeCount}
                comments={Math.max(0, postsCount - 1)}
                timestamp={formatRelativeTime(itemCreatedAt)}
                isLiked={item.isLiked || false}
                isBookmarked={item.isBookmarked || false}
                onPress={() => handleBytePress(itemId)}
                onLike={() => handleLike(itemId)}
                onComment={() => handleComment(itemId)}
                onBookmark={() => handleBookmark(itemId)}
                onShare={() => handleShare(itemId)}
                onMore={() => handleMore(itemId)}
                onTeretPress={() => handleTeretPress(item.category.name)}
                onAuthorPress={() => handleAuthorPress(posterUsername)}
              />
            );
          }}
          keyExtractor={(item) => item?.id || Math.random().toString()}
          style={styles.feedList}
          contentContainerStyle={styles.feedContent}
          showsVerticalScrollIndicator={false}
          refreshing={loading}
          onRefresh={refresh}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onEndReached={() => {
            if (hasNextPage && !loading) {
              loadMore();
            }
          }}
          onEndReachedThreshold={0.6}
          removeClippedSubviews={true}
          windowSize={7}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          updateCellsBatchingPeriod={50}
          getItemLayout={(data, index) => ({
            length: 120, // Approximate height of ByteCard
            offset: 120 * index,
            index,
          })}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    position: 'relative',
    zIndex: 1,
  },
  searchInput: {
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  searchSpinner: {
    position: 'absolute',
    right: 36,
    top: 24,
  },
  feedList: {
    flex: 1,
  },
  feedContent: {
    paddingVertical: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  emptySearchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptySearchText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySearchSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
  searchResultsHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  searchResultsTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  searchResultsSubtitle: {
    fontSize: 14,
  },
  authBanner: {
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authBannerText: {
    color: '#ffffff',
    fontSize: 14,
    flex: 1,
  },
  authBannerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  authBannerButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
});
