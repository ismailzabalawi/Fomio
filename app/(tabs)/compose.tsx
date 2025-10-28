import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/components/shared/theme-provider';
import { useCreatePost } from '@/hooks/useCreatePost';
import { HeaderBar } from '@/components/nav/HeaderBar';
import { FieldError } from '@/components/shared/FieldError';

export default function CreatePostScreen() {
  const router = useRouter();
  const { isDark, isAmoled } = useTheme();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  const isValid = useMemo(
    () => title.trim().length >= 3 && body.trim().length >= 3,
    [title, body]
  );

  const { createPost, loading, error } = useCreatePost();

  // Validation errors
  const titleError = title.trim().length > 0 && title.trim().length < 3 
    ? 'Title must be at least 3 characters' 
    : undefined;
  
  const bodyError = body.trim().length > 0 && body.trim().length < 3 
    ? 'Content must be at least 3 characters' 
    : undefined;

  async function onSubmit() {
    if (!isValid || loading) return;

    try {
      await createPost({
        title: title.trim(),
        content: body.trim(),
      });

      // Haptic feedback for success
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Clear form
      setTitle('');
      setBody('');

      // Navigate back on success
      router.back();
    } catch (e: unknown) {
      // Haptic feedback for error
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      // Error will be displayed inline via the error state
    }
  }

  const colors = {
    background: isAmoled ? '#000000' : isDark ? '#18181b' : '#ffffff',
    text: isDark ? '#f4f4f5' : '#1e293b',
    secondary: isDark ? '#a1a1aa' : '#64748b',
    primary: isDark ? '#3b82f6' : '#0ea5e9',
    border: isDark ? '#334155' : '#e2e8f0',
    inputBackground: isDark ? '#27272a' : '#f8fafc',
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <HeaderBar
        title="Create Post"
        showBackButton={true}
        showProfileButton={false}
      />

      <View style={[styles.content, { backgroundColor: colors.background }]}>
        <Text style={[styles.label, { color: colors.text }]}>Title</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter a catchy title..."
          placeholderTextColor={colors.secondary}
          autoCorrect
          autoCapitalize="sentences"
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBackground,
              borderColor: titleError ? '#ef4444' : colors.border,
              color: colors.text,
            },
          ]}
        />
        <FieldError message={titleError} testID="title-error" />

        <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>
          Content
        </Text>
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="Write something interesting..."
          placeholderTextColor={colors.secondary}
          multiline
          autoCapitalize="sentences"
          style={[
            styles.input,
            styles.textArea,
            {
              backgroundColor: colors.inputBackground,
              borderColor: bodyError ? '#ef4444' : colors.border,
              color: colors.text,
            },
          ]}
          textAlignVertical="top"
        />
        <FieldError message={bodyError} testID="body-error" />

        <FieldError message={error?.message} testID="api-error" />

        <View style={styles.footer}>
          <Text style={[styles.helperText, { color: colors.secondary }]}>
            {title.length + body.length} characters •{' '}
            {title.trim().length >= 3 && body.trim().length >= 3
              ? '✓ Ready to post'
              : 'Minimum 3 characters each'}
          </Text>

          <Pressable
            onPress={onSubmit}
            disabled={!isValid || loading}
            style={[
              styles.submitButton,
              {
                backgroundColor:
                  isValid && !loading ? colors.primary : colors.border,
                opacity: isValid && !loading ? 1 : 0.6,
              },
            ]}
          >
            {loading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitButtonText}>Publish</Text>
            )}
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    minHeight: 48,
  },
  textArea: {
    minHeight: 200,
    maxHeight: 400,
  },
  errorContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  errorText: {
    fontSize: 14,
  },
  footer: {
    marginTop: 'auto',
    paddingTop: 20,
  },
  helperText: {
    fontSize: 12,
    marginBottom: 12,
    textAlign: 'center',
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
