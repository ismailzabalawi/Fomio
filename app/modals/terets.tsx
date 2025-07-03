import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import HeaderBar from '../../components/ui/HeaderBar';
import Card from '../../components/ui/Card';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ScreenWrapper } from '../../components/ui/ScreenWrapper';

// Sample data for Terets screen
const sampleTerets = [
  {
    id: '1',
    name: 'React Native Development',
    description: 'Discussion about React Native, Expo, and mobile app development',
    members: 8432,
    posts: 1243,
    lastActive: '2 minutes ago',
  },
  {
    id: '2',
    name: 'UI/UX Design Principles',
    description: 'Share and discuss UI/UX design patterns, principles, and best practices',
    members: 6721,
    posts: 987,
    lastActive: '15 minutes ago',
  },
  {
    id: '3',
    name: 'JavaScript Ecosystem',
    description: 'All things JavaScript - frameworks, libraries, tools, and techniques',
    members: 12543,
    posts: 2341,
    lastActive: '1 hour ago',
  },
  {
    id: '4',
    name: 'Mobile App Architecture',
    description: 'Discussions about architecture patterns for mobile applications',
    members: 5432,
    posts: 765,
    lastActive: '3 hours ago',
  },
  {
    id: '5',
    name: 'Cross-Platform Development',
    description: 'Comparing approaches to building apps for multiple platforms',
    members: 7654,
    posts: 1098,
    lastActive: '1 day ago',
  },
];

export default function TeretsScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  
  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          background: '#FFFFFF',
          text: '#1C1C1E',
          secondaryText: '#8E8E93',
          cardBackground: '#F2F2F7',
          avatarBackground: '#E5E5EA',
        };
      case 'dark':
        return {
          background: '#000000',
          text: '#F2F2F2',
          secondaryText: '#8E8E93',
          cardBackground: '#1C1C1E',
          avatarBackground: '#2C2C2E',
        };
      case 'reader':
        return {
          background: '#FAF4E6',
          text: '#2E2C28',
          secondaryText: '#6C6A67',
          cardBackground: '#F5ECD7',
          avatarBackground: '#E5DBC0',
        };
      default:
        return {
          background: '#FFFFFF',
          text: '#1C1C1E',
          secondaryText: '#8E8E93',
          cardBackground: '#F2F2F7',
          avatarBackground: '#E5E5EA',
        };
    }
  };
  
  const colors = getColors();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    router.push('/(tabs)/home');
  };
  
  return (
    <ScreenWrapper>
      <HeaderBar 
        title="Terets" 
        showBackButton={true}
        showProfileButton={false}
        onBackPress={handleBackPress}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{
          paddingTop: 16,
          paddingHorizontal: 16,
          paddingBottom: insets.bottom + 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Active Terets
        </Text>
        {sampleTerets.map((teret) => (
          <Card key={teret.id} title={teret.name} variant="elevated">
            <Text style={[styles.teretDescription, { color: colors.text }]}>
              {teret.description}
            </Text>
            
            <View style={styles.teretStats}>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {teret.members.toLocaleString()}
                </Text>
                <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                  Members
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {teret.posts.toLocaleString()}
                </Text>
                <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                  Posts
                </Text>
              </View>
              
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: colors.text }]}>
                  {teret.lastActive}
                </Text>
                <Text style={[styles.statLabel, { color: colors.secondaryText }]}>
                  Last Active
                </Text>
              </View>
            </View>
            
            <View style={styles.memberAvatars}>
              {[1, 2, 3, 4].map((i) => (
                <View 
                  key={i} 
                  style={[
                    styles.avatarCircle, 
                    { backgroundColor: colors.avatarBackground, marginLeft: i > 1 ? -10 : 0 }
                  ]}
                >
                  <Text style={[styles.avatarText, { color: colors.text }]}>
                    {String.fromCharCode(64 + i)}
                  </Text>
                </View>
              ))}
              <View 
                style={[
                  styles.avatarCircle, 
                  { backgroundColor: colors.avatarBackground, marginLeft: -10 }
                ]}
              >
                <Text style={[styles.avatarText, { color: colors.text }]}>
                  +{teret.members - 4}
                </Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  teretDescription: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 16,
  },
  teretStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  memberAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
