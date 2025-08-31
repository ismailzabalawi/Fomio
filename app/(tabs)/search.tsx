import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { 
  MagnifyingGlass, 
  Coffee,
  Sparkle,
  Heart,
  Rocket
} from 'phosphor-react-native';
import { useTheme } from '../../components/shared/theme-provider';
import { HeaderBar } from '../../components/nav/HeaderBar';

export default function SearchScreen(): JSX.Element {
  const { isDark, isAmoled } = useTheme();
  const router = useRouter();
  const [randomCard, setRandomCard] = useState<number>(0);
  
  const colors = {
    background: isAmoled ? '#000000' : (isDark ? '#18181b' : '#ffffff'),
    card: isAmoled ? '#000000' : (isDark ? '#1f2937' : '#ffffff'),
    text: isDark ? '#f9fafb' : '#111827',
    secondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
    primary: isDark ? '#3b82f6' : '#0ea5e9',
    accent: isDark ? '#8b5cf6' : '#a855f7',
    input: isAmoled ? '#000000' : (isDark ? '#1f2937' : '#ffffff'),
  };

  // Generate new random card every time the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setRandomCard(Math.floor(Math.random() * 3));
    }, [])
  );

  const handleExploreFeed = () => {
    router.push('/(tabs)/');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <HeaderBar 
        title="Discover" 
        showBackButton={false}
        showProfileButton={true}
      />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar - Disabled State */}
        <View style={[styles.searchContainer, { backgroundColor: colors.input, opacity: 0.6 }]}>
          <MagnifyingGlass size={20} color={colors.secondary} weight="regular" />
          <Text style={[styles.searchInput, { color: colors.secondary }]}>
            Search coming soon... 🚀
          </Text>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {/* Icon and Title */}
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: colors.accent }]}>
              <Sparkle size={48} color="#ffffff" weight="fill" />
            </View>
          </View>

          <Text style={[styles.mainTitle, { color: colors.text }]}>
            Search & Discover
          </Text>
          
          <Text style={[styles.subtitle, { color: colors.secondary }]}>
            Coming Soon™ (probably)
          </Text>

          {/* Fun Messages */}
          <View style={styles.messageContainer}>
            {randomCard === 0 && (
              <View style={[styles.messageCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Coffee size={24} color={colors.accent} weight="regular" />
                <Text style={[styles.messageText, { color: colors.text }]}>
                  "Search is 'coming soon.' In tech-speak, that means: we'll ship it when it stops being broken. Could be 3 months. Could be 6. Definitely not now."
                </Text>
              </View>
            )}

            {randomCard === 1 && (
              <View style={[styles.messageCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Heart size={24} color={colors.accent} weight="regular" />
                <Text style={[styles.messageText, { color: colors.text }]}>
                  "Our developers are 'working hard' (read: scrolling Reels and calling it research)"
                </Text>
              </View>
            )}

            {randomCard === 2 && (
              <View style={[styles.messageCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Rocket size={24} color={colors.accent} weight="regular" />
                <Text style={[styles.messageText, { color: colors.text }]}>
                  "Meanwhile, the feed actually works. Revolutionary concept, we know"
                </Text>
              </View>
            )}
          </View>

          {/* Call to Action */}
          <TouchableOpacity 
            style={[styles.ctaButton, { backgroundColor: colors.primary }]}
            onPress={handleExploreFeed}
            accessible
            accessibilityRole="button"
            accessibilityLabel="Go to feed"
          >
            <Text style={styles.ctaButtonText}>Explore Feed Instead</Text>
          </TouchableOpacity>

          {/* Footer Note */}
          <Text style={[styles.footerNote, { color: colors.secondary }]}>
            Search functionality will be available in a future update (we promise, maybe)
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontStyle: 'italic',
  },
  mainContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 40,
    fontStyle: 'italic',
  },
  messageContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 40,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  messageText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    fontStyle: 'italic',
  },

  ctaButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  footerNote: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 