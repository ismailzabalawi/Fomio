import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../components/shared/theme-provider';
import { useDiscourseUser } from '../../shared/useDiscourseUser';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Button } from '../../components/ui/button';
import { Avatar } from '../../components/ui/avatar';
import { 
  User, 
  Camera, 
  MapPin, 
  Globe, 
  Calendar,
  Check,
  X,
  ArrowLeft
} from 'phosphor-react-native';

interface FormData {
  name: string;
  bio_raw: string;
  location: string;
  website: string;
  date_of_birth: string;
}

interface FormErrors {
  name?: string;
  bio_raw?: string;
  location?: string;
  website?: string;
  date_of_birth?: string;
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { 
    user, 
    updating, 
    updateProfile, 
    uploadAvatar,
    error,
    avatarUrl 
  } = useDiscourseUser();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    bio_raw: '',
    location: '',
    website: '',
    date_of_birth: '',
  });

  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [hasChanges, setHasChanges] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const colors = {
    background: isDark ? '#09090b' : '#f8fafc',
    cardBackground: isDark ? '#18181b' : '#fff',
    text: isDark ? '#f4f4f5' : '#18181b',
    secondary: isDark ? '#a1a1aa' : '#64748b',
    accent: isDark ? '#38bdf8' : '#0ea5e9',
    border: isDark ? '#27272a' : '#e4e4e7',
    success: isDark ? '#22c55e' : '#16a34a',
    destructive: isDark ? '#ef4444' : '#dc2626',
  };

  // Initialize form data when user loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        bio_raw: user.bio_raw || '',
        location: user.location || '',
        website: user.website || '',
        date_of_birth: user.date_of_birth || '',
      });
    }
  }, [user]);

  // Track changes
  useEffect(() => {
    if (user) {
      const hasFormChanges = 
        formData.name !== (user.name || '') ||
        formData.bio_raw !== (user.bio_raw || '') ||
        formData.location !== (user.location || '') ||
        formData.website !== (user.website || '') ||
        formData.date_of_birth !== (user.date_of_birth || '');
      
      setHasChanges(hasFormChanges);
    }
  }, [formData, user]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (formData.bio_raw.length > 3000) {
      errors.bio_raw = 'Bio must be less than 3000 characters';
    }

    if (formData.website && !isValidUrl(formData.website)) {
      errors.website = 'Please enter a valid website URL';
    }

    if (formData.date_of_birth && !isValidDate(formData.date_of_birth)) {
      errors.date_of_birth = 'Please enter a valid date (YYYY-MM-DD)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url.startsWith('http') ? url : `https://${url}`);
      return true;
    } catch {
      return false;
    }
  };

  const isValidDate = (date: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(date)) return false;
    
    const dateObj = new Date(date);
    return dateObj instanceof Date && !isNaN(dateObj.getTime());
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving.');
      return;
    }

    const success = await updateProfile(formData);
    
    if (success) {
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } else {
      Alert.alert('Error', error || 'Failed to update profile');
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          { text: 'Discard', style: 'destructive', onPress: () => router.back() }
        ]
      );
    } else {
      router.back();
    }
  };

  const handleAvatarUpload = () => {
    // In a real implementation, you would use expo-image-picker
    Alert.alert(
      'Upload Avatar',
      'Avatar upload functionality would be implemented here using expo-image-picker',
      [{ text: 'OK' }]
    );
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Edit Profile</Text>
        <TouchableOpacity 
          onPress={handleSave} 
          style={[styles.headerButton, { opacity: hasChanges ? 1 : 0.5 }]}
          disabled={!hasChanges || updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color={colors.accent} />
          ) : (
            <Check size={24} color={colors.accent} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View style={[styles.avatarSection, { backgroundColor: colors.cardBackground }]}>
          <View style={styles.avatarContainer}>
            <Avatar
              source={avatarUrl ? { uri: avatarUrl } : undefined}
              fallback={user.username.charAt(0).toUpperCase()}
              size="xl"
            />
            <TouchableOpacity 
              style={[styles.avatarButton, { backgroundColor: colors.accent }]}
              onPress={handleAvatarUpload}
              disabled={uploadingAvatar}
            >
              {uploadingAvatar ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Camera size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>
          <Text style={[styles.avatarText, { color: colors.secondary }]}>
            Tap to change your profile picture
          </Text>
        </View>

        {/* Form Fields */}
        <View style={[styles.formSection, { backgroundColor: colors.cardBackground }]}>
          {/* Username (Read-only) */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Username</Text>
            <Input
              value={user.username}
              disabled={true}
              style={{ ...styles.input, opacity: 0.6 }}
            />
            <Text style={[styles.fieldHint, { color: colors.secondary }]}>
              Username cannot be changed
            </Text>
          </View>

          {/* Display Name */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Display Name</Text>
            <Input
              value={formData.name}
              onChangeText={(value) => handleInputChange('name', value)}
              placeholder="Enter your display name"
              style={styles.input}
            />
            {formErrors.name && (
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                {formErrors.name}
              </Text>
            )}
          </View>

          {/* Bio */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Bio</Text>
            <Textarea
              value={formData.bio_raw}
              onChangeText={(value) => handleInputChange('bio_raw', value)}
              placeholder="Tell us about yourself..."
              style={styles.textarea}
              numberOfLines={4}
            />
            <Text style={[styles.fieldHint, { color: colors.secondary }]}>
              {formData.bio_raw.length}/3000 characters
            </Text>
            {formErrors.bio_raw && (
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                {formErrors.bio_raw}
              </Text>
            )}
          </View>

          {/* Location */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Location</Text>
            <View style={styles.inputWithIcon}>
              <MapPin size={20} color={colors.secondary} style={styles.inputIcon} />
              <Input
                value={formData.location}
                onChangeText={(value) => handleInputChange('location', value)}
                placeholder="Where are you located?"
                style={{ ...styles.input, ...styles.inputWithIconPadding }}
              />
            </View>
          </View>

          {/* Website */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Website</Text>
            <View style={styles.inputWithIcon}>
              <Globe size={20} color={colors.secondary} style={styles.inputIcon} />
              <Input
                value={formData.website}
                onChangeText={(value) => handleInputChange('website', value)}
                placeholder="https://yourwebsite.com"
                style={{ ...styles.input, ...styles.inputWithIconPadding }}
                keyboardType="url"
                autoCapitalize="none"
              />
            </View>
            {formErrors.website && (
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                {formErrors.website}
              </Text>
            )}
          </View>

          {/* Date of Birth */}
          <View style={styles.fieldContainer}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>Date of Birth</Text>
            <View style={styles.inputWithIcon}>
              <Calendar size={20} color={colors.secondary} style={styles.inputIcon} />
              <Input
                value={formData.date_of_birth}
                onChangeText={(value) => handleInputChange('date_of_birth', value)}
                placeholder="YYYY-MM-DD"
                style={{ ...styles.input, ...styles.inputWithIconPadding }}
              />
            </View>
            <Text style={[styles.fieldHint, { color: colors.secondary }]}>
              Format: YYYY-MM-DD (optional)
            </Text>
            {formErrors.date_of_birth && (
              <Text style={[styles.errorText, { color: colors.destructive }]}>
                {formErrors.date_of_birth}
              </Text>
            )}
          </View>
        </View>

        {/* Account Info */}
        <View style={[styles.infoSection, { backgroundColor: colors.cardBackground }]}>
          <Text style={[styles.infoTitle, { color: colors.text }]}>Account Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.secondary }]}>Trust Level:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{user.trust_level}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.secondary }]}>Posts:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{user.post_count}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.secondary }]}>Topics:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{user.topic_count}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.secondary }]}>Likes Given:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{user.likes_given}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.secondary }]}>Likes Received:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{user.likes_received}</Text>
          </View>
        </View>

        {/* Error Display */}
        {error && (
          <View style={[styles.errorContainer, { backgroundColor: colors.destructive + '20' }]}>
            <Text style={[styles.errorText, { color: colors.destructive }]}>
              {error}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  avatarSection: {
    alignItems: 'center',
    paddingVertical: 32,
    marginBottom: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  avatarText: {
    fontSize: 14,
  },
  formSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 8,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    marginBottom: 4,
  },
  textarea: {
    marginBottom: 4,
    minHeight: 100,
  },
  inputWithIcon: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 1,
  },
  inputWithIconPadding: {
    paddingLeft: 44,
  },
  fieldHint: {
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
  infoSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    margin: 24,
    padding: 16,
    borderRadius: 8,
  },
});

