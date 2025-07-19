import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  TextInput,
  FlatList,
  Image 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  MagnifyingGlass, 
  Fire, 
  TrendUp, 
  Star, 
  Users, 
  Hash,
  ArrowRight,
  BookmarkSimple,
  Heart,
  ChatCircle,
  Share
} from 'phosphor-react-native';
import { useTheme } from '../../components/shared/theme-provider';
import { HeaderBar } from '../../components/nav/HeaderBar';

interface Hub {
  id: string;
  name: string;
  description: string;
  icon: string;
  memberCount: number;
  teretCount: number;
  isPopular: boolean;
}

interface Teret {
  id: string;
  name: string;
  description: string;
  hubName: string;
  memberCount: number;
  isTrending: boolean;
}

interface Byte {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  teretName: string;
  hubName: string;
  likes: number;
  comments: number;
  timestamp: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

function DiscoverSection({ title, children }: { title: string; children: React.ReactNode }) {
  const { isDark, isAmoled } = useTheme();
  const colors = {
    text: isDark ? '#9ca3af' : '#6b7280',
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.text }]}>{title}</Text>
      {children}
    </View>
  );
}

function HubCard({ hub, onPress }: { hub: Hub; onPress: () => void }) {
  const { isDark, isAmoled } = useTheme();
  const colors = {
    background: isAmoled ? '#000000' : (isDark ? '#1f2937' : '#ffffff'),
    text: isDark ? '#f9fafb' : '#111827',
    secondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
    accent: isDark ? '#3b82f6' : '#0ea5e9',
  };

  return (
    <TouchableOpacity
      style={[styles.hubCard, { 
        backgroundColor: colors.background, 
        borderColor: colors.border 
      }]}
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${hub.name} hub`}
    >
      <View style={styles.hubHeader}>
        <View style={styles.hubIcon}>
          <Text style={[styles.hubIconText, { color: colors.accent }]}>{hub.icon}</Text>
        </View>
        <View style={styles.hubInfo}>
          <Text style={[styles.hubName, { color: colors.text }]}>{hub.name}</Text>
          <Text style={[styles.hubDescription, { color: colors.secondary }]} numberOfLines={2}>
            {hub.description}
          </Text>
        </View>
        {hub.isPopular && (
          <View style={styles.popularBadge}>
            <Fire size={12} color={colors.accent} weight="fill" />
          </View>
        )}
      </View>
      <View style={styles.hubStats}>
        <Text style={[styles.hubStat, { color: colors.secondary }]}>
          {hub.memberCount.toLocaleString()} members
        </Text>
        <Text style={[styles.hubStat, { color: colors.secondary }]}>
          {hub.teretCount} terets
        </Text>
      </View>
    </TouchableOpacity>
  );
}

function TeretCard({ teret, onPress }: { teret: Teret; onPress: () => void }) {
  const { isDark, isAmoled } = useTheme();
  const colors = {
    background: isAmoled ? '#000000' : (isDark ? '#1f2937' : '#ffffff'),
    text: isDark ? '#f9fafb' : '#111827',
    secondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
    accent: isDark ? '#3b82f6' : '#0ea5e9',
  };

  return (
    <TouchableOpacity
      style={[styles.teretCard, { 
        backgroundColor: colors.background, 
        borderColor: colors.border 
      }]}
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${teret.name} teret`}
    >
      <View style={styles.teretHeader}>
        <View style={styles.teretInfo}>
          <Text style={[styles.teretName, { color: colors.text }]}>#{teret.name}</Text>
          <Text style={[styles.teretHub, { color: colors.secondary }]}>in {teret.hubName}</Text>
        </View>
        {teret.isTrending && (
          <View style={styles.trendingBadge}>
            <TrendUp size={12} color={colors.accent} weight="fill" />
          </View>
        )}
      </View>
      <Text style={[styles.teretDescription, { color: colors.secondary }]} numberOfLines={2}>
        {teret.description}
      </Text>
      <Text style={[styles.teretStats, { color: colors.secondary }]}>
        {teret.memberCount.toLocaleString()} members
      </Text>
    </TouchableOpacity>
  );
}

function ByteCard({ byte, onPress }: { byte: Byte; onPress: () => void }) {
  const { isDark, isAmoled } = useTheme();
  const colors = {
    background: isAmoled ? '#000000' : (isDark ? '#1f2937' : '#ffffff'),
    text: isDark ? '#f9fafb' : '#111827',
    secondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
    accent: isDark ? '#3b82f6' : '#0ea5e9',
  };

  return (
    <TouchableOpacity
      style={[styles.byteCard, { 
        backgroundColor: colors.background, 
        borderColor: colors.border 
      }]}
      onPress={onPress}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${byte.title} byte`}
    >
      <View style={styles.byteHeader}>
        <Image source={{ uri: byte.author.avatar }} style={styles.byteAvatar} />
        <View style={styles.byteInfo}>
          <Text style={[styles.byteAuthor, { color: colors.text }]}>{byte.author.name}</Text>
          <Text style={[styles.byteMeta, { color: colors.secondary }]}>
            {byte.timestamp} • in {byte.teretName}
          </Text>
        </View>
      </View>
      <Text style={[styles.byteTitle, { color: colors.text }]} numberOfLines={2}>
        {byte.title}
      </Text>
      <Text style={[styles.byteContent, { color: colors.secondary }]} numberOfLines={3}>
        {byte.content}
      </Text>
      <View style={styles.byteActions}>
        <View style={styles.byteAction}>
          <Heart size={16} weight={byte.isLiked ? 'fill' : 'regular'} color={colors.secondary} />
          <Text style={[styles.byteActionText, { color: colors.secondary }]}>
            {byte.likes}
          </Text>
        </View>
        <View style={styles.byteAction}>
          <ChatCircle size={16} weight="regular" color={colors.secondary} />
          <Text style={[styles.byteActionText, { color: colors.secondary }]}>
            {byte.comments}
          </Text>
        </View>
        <View style={styles.byteAction}>
          <BookmarkSimple size={16} weight={byte.isBookmarked ? 'fill' : 'regular'} color={colors.secondary} />
        </View>
        <View style={styles.byteAction}>
          <Share size={16} weight="regular" color={colors.secondary} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function SearchScreen(): JSX.Element {
  const { isDark, isAmoled } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'hubs' | 'terets' | 'bytes'>('all');
  
  const colors = {
    background: isAmoled ? '#000000' : (isDark ? '#18181b' : '#ffffff'),
    card: isAmoled ? '#000000' : (isDark ? '#1f2937' : '#ffffff'),
    text: isDark ? '#f9fafb' : '#111827',
    secondary: isDark ? '#9ca3af' : '#6b7280',
    border: isDark ? '#374151' : '#e5e7eb',
    primary: isDark ? '#3b82f6' : '#0ea5e9',
    input: isAmoled ? '#000000' : (isDark ? '#1f2937' : '#ffffff'),
  };

  // Mock data
  const popularHubs: Hub[] = [
    {
      id: '1',
      name: 'Technology',
      description: 'Discuss the latest in tech, programming, and digital innovation',
      icon: '💻',
      memberCount: 15420,
      teretCount: 45,
      isPopular: true,
    },
    {
      id: '2',
      name: 'Design',
      description: 'Share design inspiration, tips, and creative discussions',
      icon: '🎨',
      memberCount: 8920,
      teretCount: 32,
      isPopular: true,
    },
    {
      id: '3',
      name: 'Gaming',
      description: 'Everything about games, esports, and gaming culture',
      icon: '🎮',
      memberCount: 12340,
      teretCount: 28,
      isPopular: false,
    },
  ];

  const trendingTerets: Teret[] = [
    {
      id: '1',
      name: 'react-native',
      description: 'Mobile app development with React Native',
      hubName: 'Technology',
      memberCount: 5430,
      isTrending: true,
    },
    {
      id: '2',
      name: 'ui-design',
      description: 'User interface design principles and best practices',
      hubName: 'Design',
      memberCount: 3210,
      isTrending: true,
    },
    {
      id: '3',
      name: 'indie-games',
      description: 'Independent game development and indie games',
      hubName: 'Gaming',
      memberCount: 2100,
      isTrending: false,
    },
  ];

  const recentBytes: Byte[] = [
    {
      id: '1',
      title: 'Getting Started with React Native',
      content: 'Just published my first React Native app! The development experience is amazing...',
      author: {
        name: 'Alex Chen',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      },
      teretName: 'react-native',
      hubName: 'Technology',
      likes: 42,
      comments: 8,
      timestamp: '2h ago',
      isLiked: false,
      isBookmarked: false,
    },
    {
      id: '2',
      title: 'UI/UX Design Tips',
      content: 'Remember: good design is invisible. Focus on user needs, not just aesthetics...',
      author: {
        name: 'Sarah Kim',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      },
      teretName: 'ui-design',
      hubName: 'Design',
      likes: 28,
      comments: 5,
      timestamp: '4h ago',
      isLiked: true,
      isBookmarked: true,
    },
  ];

  const handleHubPress = (hub: Hub) => {
    console.log('Hub pressed:', hub.name);
  };

  const handleTeretPress = (teret: Teret) => {
    console.log('Teret pressed:', teret.name);
  };

  const handleBytePress = (byte: Byte) => {
    console.log('Byte pressed:', byte.id);
  };

  const renderTabButton = (tab: 'all' | 'hubs' | 'terets' | 'bytes', label: string) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        { 
          backgroundColor: activeTab === tab ? colors.primary : 'transparent',
          borderColor: colors.border 
        }
      ]}
      onPress={() => setActiveTab(tab)}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`${label} tab`}
    >
      <Text style={[
        styles.tabButtonText,
        { color: activeTab === tab ? '#ffffff' : colors.text }
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

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
        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: colors.input }]}>
          <MagnifyingGlass size={20} color={colors.secondary} weight="regular" />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search hubs, terets, or bytes..."
            placeholderTextColor={colors.secondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessible
            accessibilityLabel="Search input"
          />
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          {renderTabButton('all', 'All')}
          {renderTabButton('hubs', 'Hubs')}
          {renderTabButton('terets', 'Terets')}
          {renderTabButton('bytes', 'Bytes')}
        </View>

        {/* Popular Hubs */}
        <DiscoverSection title="Popular Hubs">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {popularHubs.map((hub) => (
              <HubCard key={hub.id} hub={hub} onPress={() => handleHubPress(hub)} />
            ))}
          </ScrollView>
        </DiscoverSection>

        {/* Trending Terets */}
        <DiscoverSection title="Trending Terets">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {trendingTerets.map((teret) => (
              <TeretCard key={teret.id} teret={teret} onPress={() => handleTeretPress(teret)} />
            ))}
          </ScrollView>
        </DiscoverSection>

        {/* Recent Bytes */}
        <DiscoverSection title="Recent Bytes">
          {recentBytes.map((byte) => (
            <ByteCard key={byte.id} byte={byte} onPress={() => handleBytePress(byte)} />
          ))}
        </DiscoverSection>
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
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 24,
    gap: 8,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  tabButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
    marginHorizontal: 16,
  },
  horizontalScroll: {
    paddingHorizontal: 16,
  },
  hubCard: {
    width: 200,
    marginRight: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  hubHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  hubIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  hubIconText: {
    fontSize: 20,
  },
  hubInfo: {
    flex: 1,
  },
  hubName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  hubDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  popularBadge: {
    marginLeft: 8,
  },
  hubStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hubStat: {
    fontSize: 12,
    fontWeight: '500',
  },
  teretCard: {
    width: 180,
    marginRight: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  teretHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  teretInfo: {
    flex: 1,
  },
  teretName: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  teretHub: {
    fontSize: 12,
    fontWeight: '500',
  },
  trendingBadge: {
    marginLeft: 8,
  },
  teretDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  teretStats: {
    fontSize: 12,
    fontWeight: '500',
  },
  byteCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  byteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  byteAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  byteInfo: {
    flex: 1,
  },
  byteAuthor: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  byteMeta: {
    fontSize: 12,
  },
  byteTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 22,
  },
  byteContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  byteActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  byteAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  byteActionText: {
    fontSize: 12,
    fontWeight: '500',
  },
}); 