import React from 'react';
import { Box, Text, Pressable, VStack, Divider } from '@gluestack-ui/themed';
import { useTheme } from '../../lib/theme/theme';
import ThemeToggle from '../../components/ui/ThemeToggle';
import { Container } from '../../components/ui/Container';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TabBarContext } from '../../contexts/TabBarContext';
import { RefreshControl } from 'react-native';
import Animated from 'react-native-reanimated';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { tabBarOffset, scrollHandler } = React.useContext(TabBarContext);
  const { theme } = useTheme();
  
  // Add refresh control state
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  // Handle refresh
  const handleRefresh = React.useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Add your refresh logic here
      await new Promise(resolve => setTimeout(resolve, 1000));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return (
    <ScreenWrapper>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        bounces={true}
        overScrollMode="always"
        contentContainerStyle={{ 
          paddingTop: 128,
          paddingBottom: insets.bottom + 16,
          minHeight: '100%'
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            tintColor={theme === 'dark' ? '#FFFFFF' : '#000000'}
            progressViewOffset={insets.top}
          />
        }
      >
        <Container>
          <VStack space="lg">
            {/* Appearance Section */}
            <Box
              bg="$backgroundSecondary"
              borderRadius="$lg"
              p="$4"
              style={{ 
                transform: [{ scale: 1 }], // Enable hardware acceleration
                elevation: 1 // Improve Android performance
              }}
            >
              <Text
                fontSize="$lg"
                fontWeight="$semibold"
                color="$text"
                mb="$1"
              >
                Appearance
              </Text>
              <Text
                fontSize="$sm"
                color="$textSecondary"
                mb="$4"
              >
                Choose your preferred theme mode
              </Text>
              
              <Box alignItems="center" my="$4">
                <ThemeToggle />
              </Box>
              
              <VStack space="md">
                {[
                  {
                    title: 'Light',
                    description: 'Standard light theme with white background'
                  },
                  {
                    title: 'Dark',
                    description: 'Dark theme for low-light environments'
                  },
                  {
                    title: 'Reader',
                    description: 'Warm colors for comfortable reading'
                  }
                ].map((theme) => (
                  <VStack key={theme.title} space="xs">
                    <Text
                      fontSize="$md"
                      fontWeight="$semibold"
                      color="$text"
                      numberOfLines={1}
                    >
                      {theme.title}
                    </Text>
                    <Text
                      fontSize="$sm"
                      color="$textSecondary"
                      numberOfLines={2}
                    >
                      {theme.description}
                    </Text>
                  </VStack>
                ))}
              </VStack>
            </Box>

            {/* About Section */}
            <Box
              bg="$backgroundSecondary"
              borderRadius="$lg"
              p="$4"
              style={{ 
                transform: [{ scale: 1 }],
                elevation: 1
              }}
            >
              <Text
                fontSize="$lg"
                fontWeight="$semibold"
                color="$text"
                mb="$1"
              >
                About Fomio
              </Text>
              <Text
                fontSize="$sm"
                color="$textSecondary"
                mb="$4"
              >
                Version 1.0.0 (MVP)
              </Text>
              
              <VStack space="md">
                {['Privacy Policy', 'Terms of Service', 'Open Source Licenses'].map((item) => (
                  <Pressable
                    key={item}
                    py="$3"
                    $hover={{ bg: '$backgroundHover' }}
                    $pressed={{ opacity: 0.7 }}
                    accessibilityRole="button"
                    accessibilityLabel={item}
                  >
                    <Text
                      fontSize="$md"
                      color="$text"
                    >
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </VStack>
            </Box>

            {/* Logout Button */}
            <Pressable
              bg="$error500"
              borderRadius="$lg"
              p="$4"
              alignItems="center"
              $hover={{ bg: '$error600' }}
              $pressed={{ bg: '$error700' }}
              accessibilityRole="button"
              accessibilityLabel="Log out"
            >
              <Text
                color="$white"
                fontSize="$md"
                fontWeight="$semibold"
              >
                Log Out
              </Text>
            </Pressable>
          </VStack>
        </Container>
      </Animated.ScrollView>
    </ScreenWrapper>
  );
}

