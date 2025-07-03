import React from 'react';
import { useTheme } from '../../lib/theme/theme';
import { useReaderMode } from '../../lib/theme/use-reader-mode';
import { TabBarContext } from '../../contexts/TabBarContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated from 'react-native-reanimated';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

// GlueStack UI Components
import { Box } from '../../components/ui/box';
import { Input, InputField, InputIcon } from '../../components/ui/Input';

// Phosphor Icons
import { MagnifyingGlass } from 'phosphor-react-native';

import TrendingTerets from '../../components/discover/TrendingTerets';
import TrendingBytes from '../../components/discover/TrendingBytes';

// Sample data
const trendingTopics = [
  {
    id: '1',
    topic: 'UI Design',
    tweets: '23.5K',
    category: 'Technology',
    isPromoted: false,
  },
  {
    id: '2',
    topic: 'UX Research',
    tweets: '18.2K',
    category: 'Technology',
    isPromoted: false,
  },
  {
    id: '3',
    topic: 'Product Design',
    tweets: '32.1K',
    category: 'Technology',
    isPromoted: true,
  },
  {
    id: '4',
    topic: 'Design Systems',
    tweets: '12.8K',
    category: 'Technology',
    isPromoted: false,
  },
];

const trendingBytes = [
  {
    id: '1',
    author: {
      name: 'Sarah Johnson',
      handle: '@sarahdesigns',
      avatar: '👩‍🎨',
    },
    content: 'The Future of Design Tools in 2025: A comprehensive look at how AI and new technologies will shape our design workflows.',
    media: null,
    stats: {
      replies: 124,
      retweets: 567,
      likes: 842,
      views: 12400,
    },
    time: '2h',
  },
  {
    id: '2',
    author: {
      name: 'Alex Chen',
      handle: '@alexchen',
      avatar: '👨‍💻',
    },
    content: "Why Minimalism is Making a Comeback in 2024. Here's why less is more in today's digital landscape.",
    media: null,
    stats: {
      replies: 89,
      retweets: 432,
      likes: 567,
      views: 8900,
    },
    time: '3h',
  },
  {
    id: '3',
    author: {
      name: 'Maya Patel',
      handle: '@mayapatel',
      avatar: '👩‍🦰',
    },
    content: "Designing for Accessibility: A comprehensive guide to creating inclusive digital experiences.",
    media: null,
    stats: {
      replies: 156,
      retweets: 789,
      likes: 1024,
      views: 15200,
    },
    time: '4h',
  },
];

export default function DiscoverScreen() {
  const { theme } = useTheme();
  const { isReaderMode } = useReaderMode();
  const { tabBarOffset, scrollHandler } = React.useContext(TabBarContext);
  const insets = useSafeAreaInsets();

  // Convert theme string to 'light' | 'dark' for TrendingBytes
  const themeMode = theme === 'dark' ? 'dark' : 'light';

  return (
    <ScreenWrapper>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingTop: 128,
          paddingBottom: insets.bottom + 16
        }}
        className={`${isReaderMode ? 'bg-background' : 'bg-background-50 dark:bg-background-800'}`}
      >
        {/* Search Section */}
        <Box 
          className={`
            px-4 
            mb-4 
            ${isReaderMode ? 'bg-background' : 'bg-background-50 dark:bg-background-800'}
          `}
        >
          <Input
            size="lg"
            className={`
              rounded-full 
              border 
              ${isReaderMode 
                ? 'border-border-300 bg-background-100' 
                : 'border-border-200 dark:border-border-800 bg-background-50 dark:bg-background-800'
              }
            `}
          >
            <InputIcon as={Box}>
              <MagnifyingGlass 
                size={20}
                weight="bold"
                color={theme === 'dark' ? '$muted.600' : '$muted.400'}
              />
            </InputIcon>
            <InputField
              placeholder="Search Fomio"
              placeholderTextColor={theme === 'dark' ? '$muted.600' : '$muted.400'}
              className={isReaderMode 
                ? 'text-text-900 font-serif' 
                : 'text-text-900 dark:text-text-100'
              }
            />
          </Input>
        </Box>

        {/* Trending Terets Section */}
        <TrendingTerets 
          topics={trendingTopics} 
          theme={theme}
          isReaderMode={isReaderMode}
        />

        <TrendingBytes 
          bytes={trendingBytes} 
          theme={themeMode}
          isReaderMode={isReaderMode}
        />
      </Animated.ScrollView>
    </ScreenWrapper>
  );
}
