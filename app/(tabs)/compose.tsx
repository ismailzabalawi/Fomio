import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  ScrollView,
  ActivityIndicator,
  Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useTheme } from '../../components/shared/theme-provider';
import { useCategories, useCreateTopic, useAuth } from '../../hooks';
import { 
  CaretDown, 
  Hash, 
  Users, 
  TrendUp, 
  Check
} from 'phosphor-react-native';
import { Picker } from '@react-native-picker/picker';

interface Teret {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  isPopular: boolean;
  isVerified: boolean;
  isPublic: boolean;
  isRestricted: boolean;
  minTrustLevel: number;
  category: string;
  color: string;
  text_color: string;
  slug: string;
  topic_count: number;
  post_count: number;
}

// Transform Discourse categories to Teret format while preserving the exact same interface
function transformCategoryToTeret(category: any): Teret {
  return {
    id: category.id,
    name: category.slug, // Use slug as name for consistency
    description: category.description || category.description_excerpt || 'No description available',
    memberCount: category.post_count || 0,
    isPopular: category.topic_count > 100, // Consider popular if > 100 topics
    isVerified: category.read_restricted === false, // Public categories are verified
    isPublic: category.read_restricted === false, // Public categories are accessible to all
    isRestricted: category.read_restricted === true, // Restricted categories need permissions
    minTrustLevel: category.min_trust_level || 0, // Minimum trust level required
    category: category.name,
    color: category.color,
    text_color: category.text_color,
    slug: category.slug,
    topic_count: category.topic_count,
    post_count: category.post_count,
  };
}

export default function ComposeScreen(): JSX.Element {
  const { isDark, isAmoled } = useTheme();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [selectedTeret, setSelectedTeret] = useState<Teret | null>(null);
  const [showTeretDropdown, setShowTeretDropdown] = useState(false);
  
  // Real API integration - preserving all existing design and logic
  const { 
    data: categoriesData, 
    isLoading: isLoadingCategories, 
    error: categoriesError,
    refetch: refetchCategories
  } = useCategories();
  const createTopicMutation = useCreateTopic();
  const { isAuthenticated, user } = useAuth();
  
  // Transform real Discourse categories to Teret format with permission filtering
  const realTerets: Teret[] = categoriesData?.category_list?.categories
    ?.map(transformCategoryToTeret)
    ?.filter(teret => {
      // Filter based on user permissions and teret restrictions
      if (!isAuthenticated) {
        // Unauthenticated users can only see public terets
        return teret.isPublic;
      }
      
      // Authenticated users - check trust level and restrictions
      if (teret.isRestricted) {
        // Check if user meets minimum trust level requirement
        const userTrustLevel = user?.trust_level || 0;
        return userTrustLevel >= teret.minTrustLevel;
      }
      
      // Public terets are always accessible to authenticated users
      return true;
    }) || [];
  
  // Auto-refresh categories every 5 minutes and when app comes to foreground
  useEffect(() => {
    // Initial fetch
    refetchCategories();
    
    // Set up interval for background refresh (every 5 minutes)
    const intervalId = setInterval(() => {
      refetchCategories();
    }, 5 * 60 * 1000); // 5 minutes
    
    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [refetchCategories]);
  
  // Refresh categories when user creates a topic (optimistic update)
  useEffect(() => {
    if (createTopicMutation.createError === null && !createTopicMutation.isCreating) {
      // Refresh categories to get updated topic counts
      refetchCategories();
    }
  }, [createTopicMutation.createError, createTopicMutation.isCreating, refetchCategories]);
  
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

  const selectTeret = (teret: Teret) => {
    // Check if user has permission to post in this teret
    if (teret.isRestricted && isAuthenticated) {
      const userTrustLevel = user?.trust_level || 0;
      if (userTrustLevel < teret.minTrustLevel) {
        Alert.alert(
          'Access Restricted',
          `You need Trust Level ${teret.minTrustLevel} to post in ${teret.name}. Your current level is ${userTrustLevel}.`,
          [{ text: 'OK' }]
        );
        return;
      }
    }
    
    setSelectedTeret(teret);
  };

  const clearSelection = () => {
    setSelectedTeret(null);
  };

  const handlePost = async (): Promise<void> => {
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please sign in to create a Byte');
      router.push('/(auth)/signin');
      return;
    }
    
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your Byte');
      return;
    }
    
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content');
      return;
    }
    
    if (!selectedTeret) {
      Alert.alert('Error', 'Please select a teret to post in');
      return;
    }
    
    // Check if user has permission to post in this teret
    if (selectedTeret.isRestricted) {
      const userTrustLevel = user?.trust_level || 0;
      if (userTrustLevel < selectedTeret.minTrustLevel) {
        Alert.alert(
          'Access Denied',
          `You need Trust Level ${selectedTeret.minTrustLevel} to post in ${selectedTeret.name}. Your current level is ${userTrustLevel}.`,
          [{ text: 'OK' }]
        );
        return;
      }
    }
    
    try {
      // Create the topic using the real Discourse API
      await createTopicMutation.createTopicAsync({
        title: title.trim(),
        raw: content.trim(),
        category: selectedTeret.id,
      });
      
      // Success - show the same success message and behavior
      Alert.alert('Success', `Your Byte "${title}" has been published in ${selectedTeret.name}!`);
      setTitle('');
      setContent('');
      setSelectedTeret(null);
      router.back();
    } catch (error) {
      // Error handling while preserving the design
      Alert.alert(
        'Error', 
        'Failed to publish your Byte. Please try again.',
        [{ text: 'OK' }]
      );
      console.error('Failed to create topic:', error);
    }
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



  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={[styles.cancelText, { color: colors.secondary }]}>Cancel</Text>
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>New Byte</Text>
          {!isAuthenticated && (
            <Text style={[styles.authIndicator, { color: colors.warning }]}>
              Sign in required
            </Text>
          )}
        </View>
        <TouchableOpacity 
          onPress={handlePost}
          style={[
            styles.postButton, 
            { 
              backgroundColor: selectedTeret && title.trim() && content.trim() ? colors.primary : colors.secondary,
              opacity: selectedTeret && title.trim() && content.trim() ? 1 : 0.5
            }
          ]}
          disabled={!selectedTeret || !title.trim() || !content.trim() || createTopicMutation.isCreating}
        >
          {createTopicMutation.isCreating ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={[styles.postText, { color: '#ffffff' }]}>Post</Text>
          )}
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Teret Selection */}
        <View style={styles.teretSection}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionLabel, { color: colors.secondary }]}>
              Post in Teret
            </Text>
            <TouchableOpacity
              onPress={() => refetchCategories()}
              style={styles.refreshButton}
              disabled={isLoadingCategories}
            >
              <TrendUp 
                size={16} 
                color={isLoadingCategories ? colors.secondary : colors.primary} 
                weight="regular"
              />
            </TouchableOpacity>
          </View>
          
          {isLoadingCategories ? (
            <View style={[styles.teretSelector, { 
              backgroundColor: colors.card,
              borderColor: colors.border 
            }]}>
              <View style={styles.loadingTeret}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={[styles.loadingText, { color: colors.secondary }]}>
                  Loading terets...
                </Text>
              </View>
            </View>
          ) : categoriesError ? (
            <View style={[styles.teretSelector, { 
              backgroundColor: colors.card,
              borderColor: colors.border 
            }]}>
              <View style={styles.errorTeret}>
                <Text style={[styles.errorText, { color: '#ef4444' }]}>
                  Failed to load terets
                </Text>
              </View>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.dropdownButton, { 
                  backgroundColor: colors.inputBg, 
                  borderColor: selectedTeret ? colors.primary : colors.inputBorder 
                }]}
                onPress={() => setShowTeretDropdown(!showTeretDropdown)}
                activeOpacity={0.7}
              >
                <View style={styles.dropdownButtonContent}>
                  {selectedTeret ? (
                    <View style={styles.selectedTeretDisplay}>
                      <View style={[styles.teretColor, { backgroundColor: `#${selectedTeret.color}` }]} />
                      <Text style={[styles.selectedTeretText, { color: colors.text }]}>
                        {selectedTeret.name}
                      </Text>
                      <View style={[styles.verifiedBadge, { backgroundColor: colors.success }]}>
                        <Check size={12} color="#ffffff" weight="bold" />
                      </View>
                    </View>
                  ) : (
                    <Text style={[styles.dropdownPlaceholder, { color: colors.secondary }]}>
                      Choose a teret to post in...
                    </Text>
                  )}
                  <CaretDown 
                    size={20} 
                    color={selectedTeret ? colors.primary : colors.secondary} 
                    weight="regular"
                    style={[
                      styles.dropdownArrow,
                      { transform: [{ rotate: showTeretDropdown ? '180deg' : '0deg' }] }
                    ]}
                  />
                </View>
              </TouchableOpacity>
              
              {/* Dropdown Picker */}
              {showTeretDropdown && realTerets.length > 0 && (
                <View style={[styles.dropdownPickerContainer, { 
                  backgroundColor: colors.card,
                  borderColor: colors.inputBorder 
                }]}>
                  <Picker
                    selectedValue={selectedTeret?.id || ''}
                    onValueChange={(itemValue) => {
                      const teret = realTerets.find(t => t.id === itemValue);
                      if (teret) {
                        selectTeret(teret);
                        setShowTeretDropdown(false);
                      }
                    }}
                    style={[styles.dropdownPicker, { color: colors.text }]}
                    itemStyle={Platform.OS === 'ios' ? { color: colors.text } : undefined}
                  >
                                      <Picker.Item 
                    label="Choose a teret to post in..." 
                    value="" 
                    color={colors.secondary}
                  />
                  {realTerets.map((teret) => (
                    <Picker.Item 
                      key={teret.id} 
                      label={teret.isRestricted ? `${teret.name} 🔒` : teret.name}
                      value={teret.id}
                      color={teret.isRestricted ? colors.warning : colors.text}
                    />
                  ))}
                  </Picker>
                </View>
              )}
              
              {selectedTeret && (
                <View style={styles.selectedTeretInfo}>
                  <View style={styles.selectedTeretMain}>
                    <Hash size={16} color={colors.primary} weight="fill" />
                    <View style={styles.selectedTeretDetails}>
                      <Text style={[styles.selectedTeretName, { color: colors.text }]}>
                        {selectedTeret.name}
                      </Text>
                      <Text style={[styles.selectedTeretStats, { color: colors.secondary }]}>
                        {formatMemberCount(selectedTeret.memberCount)} members • {selectedTeret.topic_count} topics
                        {selectedTeret.isRestricted && (
                          <Text style={{ color: colors.warning, fontWeight: '600' }}>
                            {' • Requires Trust Level '}{selectedTeret.minTrustLevel}
                          </Text>
                        )}
                      </Text>
                    </View>
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
                    <Text style={[styles.clearButtonText, { color: colors.secondary }]}>
                      Clear
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>

        {/* Title Input */}
        <View style={styles.titleSection}>
          <Text style={[styles.sectionLabel, { color: colors.secondary }]}>
            Byte Title
          </Text>
          <TextInput
            style={[
              styles.titleInput,
              {
                backgroundColor: colors.inputBg,
                borderColor: colors.inputBorder,
                color: colors.text,
              }
            ]}
            placeholder="Give your Byte a catchy title..."
            placeholderTextColor={colors.secondary}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
            autoFocus
            accessible
            accessibilityLabel="Byte title input"
          />
          <Text style={[
            styles.characterCount, 
            { 
              color: title.length > 80 ? colors.warning : colors.secondary,
              fontWeight: title.length > 80 ? '600' : '400'
            }
          ]}>
            {title.length}/100 characters
          </Text>
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
            accessible
            accessibilityLabel="Post content input"
          />
          <Text style={[styles.characterCount, { color: colors.secondary }]}>
            {content.length} characters
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
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  authIndicator: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 2,
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
  titleSection: {
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
  loadingTeret: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTeret: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  picker: {
    flex: 1,
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
  clearButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  placeholderTeret: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholderText: {
    fontSize: 16,
  },
  titleInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 18,
    fontWeight: '600',
    minHeight: 56,
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  verifiedBadge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  dropdownButton: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  dropdownButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedTeretDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  teretColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  selectedTeretText: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  dropdownPlaceholder: {
    fontSize: 16,
    color: '#9ca3af',
  },
  dropdownArrow: {
    marginLeft: 8,
  },
  dropdownPickerContainer: {
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 8,
    overflow: 'hidden',
  },
  dropdownPicker: {
    height: 200,
  },
  selectedTeretMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  selectedTeretDetails: {
    flex: 1,
    marginLeft: 8,
  },
  selectedTeretStats: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  refreshButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
}); 