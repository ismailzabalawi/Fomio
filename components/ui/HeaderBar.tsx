import React from 'react';
import { View, Text, StyleSheet, Pressable, StatusBar, StatusBarStyle } from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import { CaretLeft, User } from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { Box, HStack, Text as GluestackText } from '@gluestack-ui/themed';

interface HeaderBarProps {
  title?: string;
  showBackButton?: boolean;
  showProfileButton?: boolean;
  onBackPress?: () => void;
  onProfilePress?: () => void;
  rightComponent?: React.ReactNode;
  statusBarStyle?: StatusBarStyle;
  statusBarBackgroundColor?: string;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  title = '',
  showBackButton = true,
  showProfileButton = true,
  onBackPress,
  onProfilePress,
  rightComponent,
  statusBarStyle,
  statusBarBackgroundColor,
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          background: '#FFFFFF',
          title: '#1C1C1E',
          icon: '#1C1C1E',
          border: '#F2F2F7',
          statusBar: 'dark-content' as StatusBarStyle,
        };
      case 'dark':
        return {
          background: '#000000',
          title: '#F2F2F2',
          icon: '#F2F2F2',
          border: '#1C1C1E',
          statusBar: 'light-content' as StatusBarStyle,
        };
      case 'reader':
        return {
          background: '#FAF4E6',
          title: '#2E2C28',
          icon: '#2E2C28',
          border: '#D8CCAF',
          statusBar: 'dark-content' as StatusBarStyle,
        };
      default:
        return {
          background: '#FFFFFF',
          title: '#1C1C1E',
          icon: '#1C1C1E',
          border: '#F2F2F7',
          statusBar: 'dark-content' as StatusBarStyle,
        };
    }
  };
  
  const colors = getColors();
  const isHomePage = pathname === '/home';
  
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const handleProfilePress = () => {
    if (onProfilePress) {
      onProfilePress();
    } else {
      router.push('/modals/profile');
    }
  };
  
  return (
    <Box
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
          borderBottomWidth: StyleSheet.hairlineWidth,
        },
      ]}
      accessibilityRole="header"
    >
      <StatusBar
        barStyle={statusBarStyle || colors.statusBar}
        backgroundColor={statusBarBackgroundColor || colors.background}
        translucent
      />
      
      <HStack
        style={styles.content}
        space="md"
        alignItems="center"
        justifyContent="space-between"
      >
        <Box style={styles.leftContainer}>
          {!isHomePage && showBackButton && (
            <Pressable
              onPress={handleBackPress}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel="Go back"
            >
              <CaretLeft size={24} color={colors.icon} weight="bold" />
            </Pressable>
          )}
        </Box>
        
        <Box style={styles.centerContainer}>
          <GluestackText
            style={[
              styles.title,
              {
                color: colors.title,
                fontFamily: theme === 'reader' ? 'Georgia' : 'System',
              },
            ]}
            numberOfLines={1}
            accessibilityRole="header"
          >
            {title}
          </GluestackText>
        </Box>
        
        <Box style={styles.rightContainer}>
          {rightComponent || (showProfileButton && (
            <Pressable
              onPress={handleProfilePress}
              style={styles.iconButton}
              accessibilityRole="button"
              accessibilityLabel="Profile"
            >
              <User size={24} color={colors.icon} weight="regular" />
            </Pressable>
          ))}
        </Box>
      </HStack>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  content: {
    height: 56,
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  iconButton: {
    padding: 8,
    borderRadius: 20,
  },
});

export default HeaderBar;
