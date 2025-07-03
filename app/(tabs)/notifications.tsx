import React from 'react';
import { Box, Text, Pressable, Avatar, VStack } from '@gluestack-ui/themed';
import { Container } from '../../components/ui/Container';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBarContext } from './_layout';
import Animated, { 
  useAnimatedScrollHandler,
  useSharedValue,
  withSpring
} from 'react-native-reanimated';
import { NotificationIcon } from '@/components/icons';
import { RefreshControl } from 'react-native';
// Sample notifications data
const notifications = [
  {
    id: '1',
    type: 'comment',
    author: 'Alex Chen',
    authorAvatar: '👨‍🔬',
    content: "I've been implementing these principles in my recent projects with great results!",
    timeAgo: '3 hours ago',
    mentions: [],
  },
  {
    id: '2',
    type: 'like',
    author: 'Sarah Johnson',
    authorAvatar: '👩‍💻',
    content: 'liked your post',
    timeAgo: '5 hours ago',
    mentions: [],
  },
  {
    id: '3',
    type: 'mention',
    author: 'Michael Brown',
    authorAvatar: '👨‍🎨',
    content: 'mentioned you in a comment',
    timeAgo: '1 day ago',
    mentions: ['@you'],
  },
];

interface NotificationItem {
  id: string;
  type: string;
  author: string;
  authorAvatar: string;
  content: string;
  timeAgo: string;
  mentions: string[];
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { tabBarOffset } = React.useContext(TabBarContext);
  
  // Add refresh control state
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  
  // Track scroll position with shared value
  const scrollY = useSharedValue(0);
  
  // Proper scroll handler with animation
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const offsetY = event.contentOffset.y;
      scrollY.value = offsetY;
      
      // Smooth tab bar animation
      if (tabBarOffset) {
        // Hide tab bar when scrolling down, show when scrolling up
        const diff = offsetY - (scrollY.value || 0);
        tabBarOffset.value = withSpring(
          Math.min(Math.max(tabBarOffset.value + diff, -80), 0),
          { damping: 15 }
        );
      }
    },
  });

  // Handle refresh
  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Add your refresh logic here
      // await refetchNotifications();
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return (
    <Box flex={1} bg="$background">
      <Animated.ScrollView
        contentContainerStyle={{ 
          paddingTop: 128,
          paddingBottom: insets.bottom + 16,
          minHeight: '100%'
        }}
        onScroll={scrollHandler}
        scrollEventThrottle={16} // For smooth animations
        showsVerticalScrollIndicator={false}
        bounces={true}
        overScrollMode="always"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor="$primary500" // Use theme color
            progressViewOffset={insets.top} // Account for safe area
          />
        }
        // Improve scroll performance
        removeClippedSubviews={true}
        maintainVisibleContentPosition={{
          minIndexForVisible: 0,
          autoscrollToTopThreshold: 10
        }}
      >
        <Container>
          <VStack space="md">
            {notifications.map((notification: NotificationItem) => (
              <Pressable
                key={notification.id}
                className="flex-row p-4 border-b border-border"
                // Add haptic feedback
                onPress={() => {
                  // Handle notification press
                }}
                $pressed={{ opacity: 0.7 }}
              >
                <Avatar 
                  size="md"
                  borderRadius="$full"
                  bgColor="$primary500"
                  marginRight="$3"
                >
                  <Text color="$white" fontWeight="$semibold">
                    {notification.authorAvatar}
                  </Text>
                </Avatar>
                
                <VStack flex={1} space="xs">
                  <Text
                    fontSize="$md"
                    fontWeight="$semibold"
                    color="$text"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {notification.author}
                  </Text>
                  <Text
                    fontSize="$sm"
                    color="$textSecondary"
                    numberOfLines={2}
                    ellipsizeMode="tail"
                  >
                    {notification.content}
                  </Text>
                  <Text
                    fontSize="$xs"
                    color="$textTertiary"
                  >
                    {notification.timeAgo}
                  </Text>
                </VStack>
              </Pressable>
            ))}
          </VStack>
        </Container>
      </Animated.ScrollView>
    </Box>
  );
}

