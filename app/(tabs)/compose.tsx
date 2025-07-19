import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  Modal,
  FlatList,
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../components/shared/theme-provider';
import { 
  CaretDown, 
  Hash, 
  Users, 
  TrendUp, 
  Star,
  Check,
  X
} from 'phosphor-react-native';

interface Teret {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPopular: boolean;
  isVerified: boolean;
  category: string;
}

const mockTerets: Teret[] = [
  {
    id: '1',
    name: 'react-native',
    description: 'React Native development, tips, and best practices',
    memberCount: 15420,
    isPopular: true,
    isVerified: true,
    category: 'Technology'
  },
  {
    id: '2',
    name: 'mobile-design',
    description: 'Mobile UI/UX design inspiration and discussions',
    memberCount: 8920,
    isPopular: true,
    isVerified: true,
    category: 'Design'
  },
  {
    id: '3',
    name: 'expo-dev',
    description: 'Expo development and troubleshooting',
    memberCount: 12340,
    isPopular: true,
    isVerified: true,
    category: 'Technology'
  },
  {
    id: '4',
    name: 'typescript',
    description: 'TypeScript tips, tricks, and advanced patterns',
    memberCount: 9870,
    isPopular: false,
    isVerified: true,
    category: 'Technology'
  },
  {
    id: '5',
    name: 'ui-components',
    description: 'Reusable UI components and design systems',
    memberCount: 6540,
    isPopular: false,
    isVerified: false,
    category: 'Design'
  },
  {
    id: '6',
    name: 'performance',
    description: 'Mobile app performance optimization',
    memberCount: 4320,
    isPopular: false,
    isVerified: false,
    category: 'Technology'
  },
  {
    id: '7',
    name: 'accessibility',
    description: 'Making apps accessible for everyone',
    memberCount: 2100,
    isPopular: false,
    isVerified: false,
    category: 'Design'
  },
  {
    id: '8',
    name: 'testing',
    description: 'Mobile app testing strategies and tools',
    memberCount: 3450,
    isPopular: false,
    isVerified: false,
    category: 'Technology'
  }
];

export default function ComposeScreen(): JSX.Element {
  const { isDark, isAmoled } = useTheme();
  const [content, setContent] = useState<string>('');
  const [selectedTeret, setSelectedTeret] = useState<Teret | null>(null);
  const [showTeretDropdown, setShowTeretDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const animatedValue = useRef(new Animated.Value(0)).current;
  
  const colors = {
    background: isAmoled ? '#000000' : (isDark ? '#18181b' : '#ffffff'),
    card: isAmoled ? '#000000' : (isDark ? '#27272a' : '#ffffff'),
    text: isDark ? '#f4f4f5' : '#1e293b',
    secondary: isDark ? '#a1a1aa' : '#64748b',
    primary: isDark ? '#38bdf8' : '#0ea5e9',
    accent: isDark ? '#8b5cf6' : '#7c3aed',
    success: isDark ? '#10b981' : '#059669',
    warning: isDark ? '#f59e0b' : '#d97706',
    inputBg: isDark ? '#27272a' : '#ffffff',
    inputBorder: isDark ? '#334155' : '#d1d5db',
    border: isDark ? '#334155' : '#e2e8f0',
    overlay: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.5)',
  };

  const filteredTerets = mockTerets.filter(teret =>
    teret.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    teret.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleDropdown = () => {
    setShowTeretDropdown(!showTeretDropdown);
    Animated.timing(animatedValue, {
      toValue: showTeretDropdown ? 0 : 1,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const selectTeret = (teret: Teret) => {
    setSelectedTeret(teret);
    setShowTeretDropdown(false);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const clearSelection = () => {
    setSelectedTeret(null);
  };

  const handlePost = (): void => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content');
      return;
    }
    
    if (!selectedTeret) {
      Alert.alert('Error', 'Please select a teret to post in');
      return;
    }
    
    Alert.alert('Success', `Your post has been published in ${selectedTeret.name}!`);
    setContent('');
    setSelectedTeret(null);
    router.back();
  };

  const handleCancel = (): void => {
    router.back();
  };

  const formatMemberCount = (count: number): string => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const renderTeretItem = ({ item }: { item: Teret }) => (
    <TouchableOpacity
      style={[styles.teretItem, { 
        backgroundColor: colors.card,
        borderColor: colors.border 
      }]}
      onPress={() => selectTeret(item)}
      accessible
      accessibilityRole="button"
      accessibilityLabel={`Select teret ${item.name}`}
    >
      <View style={styles.teretHeader}>
        <View style={styles.teretInfo}>
          <View style={styles.teretNameRow}>
            <Hash size={16} color={colors.primary} weight="fill" />
            <Text style={[styles.teretName, { color: colors.text }]}>
              {item.name}
            </Text>
            {item.isVerified && (
              <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
                <Check size={12} color="#ffffff" weight="bold" />
              </View>
            )}
          </View>
          <Text style={[styles.teretDescription, { color: colors.secondary }]} numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <View style={styles.teretStats}>
          <View style={styles.statItem}>
            <Users size={14} color={colors.secondary} weight="regular" />
            <Text style={[styles.statText, { color: colors.secondary }]}>
              {formatMemberCount(item.memberCount)}
            </Text>
          </View>
                     {item.isPopular && (
             <View style={styles.statItem}>
               <TrendUp size={14} color={colors.warning} weight="fill" />
               <Text style={[styles.statText, { color: colors.warning }]}>
                 Popular
               </Text>
             </View>
           )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={[styles.cancelText, { color: colors.secondary }]}>Cancel</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>New Byte</Text>
        <TouchableOpacity 
          onPress={handlePost}
          style={[
            styles.postButton, 
            { 
              backgroundColor: selectedTeret && content.trim() ? colors.primary : colors.secondary,
              opacity: selectedTeret && content.trim() ? 1 : 0.5
            }
          ]}
          disabled={!selectedTeret || !content.trim()}
        >
          <Text style={[styles.postText, { color: '#ffffff' }]}>Post</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Teret Selection */}
        <View style={styles.teretSection}>
          <Text style={[styles.sectionLabel, { color: colors.secondary }]}>
            Post in Teret
          </Text>
          <TouchableOpacity
            style={[styles.teretSelector, { 
              backgroundColor: colors.card,
              borderColor: colors.border 
            }]}
            onPress={toggleDropdown}
            accessible
            accessibilityRole="button"
            accessibilityLabel={selectedTeret ? `Selected teret: ${selectedTeret.name}` : "Select a teret to post in"}
          >
            {selectedTeret ? (
              <View style={styles.selectedTeret}>
                <View style={styles.selectedTeretInfo}>
                  <Hash size={16} color={colors.primary} weight="fill" />
                  <Text style={[styles.selectedTeretName, { color: colors.text }]}>
                    {selectedTeret.name}
                  </Text>
                  {selectedTeret.isVerified && (
                    <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
                      <Check size={12} color="#ffffff" weight="bold" />
                    </View>
                  )}
                </View>
                <TouchableOpacity
                  onPress={clearSelection}
                  style={styles.clearButton}
                  accessible
                  accessibilityRole="button"
                  accessibilityLabel="Clear teret selection"
                >
                  <X size={16} color={colors.secondary} weight="regular" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.placeholderTeret}>
                <Text style={[styles.placeholderText, { color: colors.secondary }]}>
                  Choose a teret to post in...
                </Text>
                <CaretDown size={16} color={colors.secondary} weight="regular" />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Content Input */}
        <View style={styles.contentSection}>
          <Text style={[styles.sectionLabel, { color: colors.secondary }]}>
            Your Byte
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.inputBorder,
                color: colors.text,
              }
            ]}
            placeholder="What's on your mind?"
            placeholderTextColor={colors.secondary}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            autoFocus
            accessible
            accessibilityLabel="Post content input"
          />
          <Text style={[styles.characterCount, { color: colors.secondary }]}>
            {content.length} characters
          </Text>
        </View>
      </ScrollView>

      {/* Teret Dropdown Modal */}
      <Modal
        visible={showTeretDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowTeretDropdown(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, { backgroundColor: colors.overlay }]}
          activeOpacity={1}
          onPress={() => setShowTeretDropdown(false)}
        >
          <View style={[styles.dropdownContainer, { backgroundColor: colors.card }]}>
            <View style={styles.dropdownHeader}>
              <Text style={[styles.dropdownTitle, { color: colors.text }]}>
                Select Teret
              </Text>
              <TouchableOpacity
                onPress={() => setShowTeretDropdown(false)}
                style={styles.closeButton}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Close teret selection"
              >
                <X size={20} color={colors.secondary} weight="regular" />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.searchInput, {
                backgroundColor: colors.inputBg,
                borderColor: colors.inputBorder,
                color: colors.text,
              }]}
              placeholder="Search terets..."
              placeholderTextColor={colors.secondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessible
              accessibilityLabel="Search terets input"
            />
            
            <FlatList
              data={filteredTerets}
              renderItem={renderTeretItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              style={styles.teretList}
              contentContainerStyle={styles.teretListContent}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  postText: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  teretSection: {
    marginBottom: 24,
  },
  contentSection: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  teretSelector: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    minHeight: 56,
    justifyContent: 'center',
  },
  selectedTeret: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedTeretInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedTeretName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  clearButton: {
    padding: 4,
  },
  placeholderTeret: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholderText: {
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  characterCount: {
    fontSize: 12,
    marginTop: 8,
    textAlign: 'right',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  dropdownContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: Dimensions.get('window').height * 0.7,
    paddingBottom: 20,
  },
  dropdownHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  searchInput: {
    margin: 20,
    marginTop: 0,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
  },
  teretList: {
    flex: 1,
  },
  teretListContent: {
    paddingHorizontal: 20,
  },
  teretItem: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  teretHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  teretInfo: {
    flex: 1,
    marginRight: 12,
  },
  teretNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  teretName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  teretDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  teretStats: {
    alignItems: 'flex-end',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  statText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
}); 