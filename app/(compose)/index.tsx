import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function ComposeScreen() {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handlePost = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please enter some content.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Your byte has been posted!');
      router.replace('/feed');
    }, 1000);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Byte</Text>
        <View style={styles.headerPlaceholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.userRow}>
          <Image source={{ uri: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face' }} style={styles.avatar} />
          <Text style={styles.username}>@johndoe</Text>
        </View>
        <TextInput
          style={styles.textarea}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
        />
        <View style={styles.tagsSection}>
          <View style={styles.tagsInputRow}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add a tag"
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}>
              <Text style={styles.addTagButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tagsRow}>
            {tags.map((tag) => (
              <TouchableOpacity key={tag} style={styles.tag} onPress={() => handleRemoveTag(tag)}>
                <Text style={styles.tagText}>#{tag} ✕</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TouchableOpacity
          style={[styles.postButton, loading && styles.disabledButton]}
          onPress={handlePost}
          disabled={loading}
        >
          <Text style={styles.postButtonText}>{loading ? 'Posting...' : 'Post Byte'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: '#0ea5e9',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    padding: 20,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    textAlignVertical: 'top',
  },
  tagsSection: {
    marginBottom: 20,
  },
  tagsInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  addTagButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#e0f2fe',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    color: '#0284c7',
    fontSize: 14,
    fontWeight: '600',
  },
  postButton: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  postButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

