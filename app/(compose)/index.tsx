import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import { useDiscourseSettings } from '../../shared/useDiscourseSettings';

// Placeholder for TeretSelectionScreen
function TeretSelectionScreen({ onSelect }: { onSelect: (teret: { id: string; name: string }) => void }) {
  // Replace with real teret fetching logic
  const terets = [
    { id: 'react-native', name: 'React Native' },
    { id: 'ai', name: 'AI & Machine Learning' },
    { id: 'web', name: 'Web Development' },
  ];
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>Choose a Teret</Text>
      {terets.map((teret) => (
        <TouchableOpacity key={teret.id} onPress={() => onSelect(teret)} style={{ padding: 12 }}>
          <Text style={{ fontSize: 16 }}>{teret.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ComposeScreen() {
  // Mock teret data
  const teretOptions = [
    { label: 'React Native', value: 'react-native' },
    { label: 'AI & Machine Learning', value: 'ai' },
    { label: 'Web Development', value: 'web' },
    { label: 'Design', value: 'design' },
    { label: 'Startups', value: 'startups' },
  ];

  const [teretOpen, setTeretOpen] = useState(false);
  const [selectedTeret, setSelectedTeret] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { minTitle, minPost, loading: settingsLoading } = useDiscourseSettings();

  const selectedTeretLabel = teretOptions.find(t => t.value === selectedTeret)?.label || '';

  const handlePost = async () => {
    if (settingsLoading) {
      Alert.alert('Please wait', 'Loading post requirements...');
      return;
    }
    if (title.trim().length < minTitle) {
      Alert.alert('Error', `Title must be at least ${minTitle} characters.`);
      return;
    }
    if (content.trim().length < minPost) {
      Alert.alert('Error', `Content must be at least ${minPost} characters.`);
      return;
    }
    if (!selectedTeret) {
      Alert.alert('Error', 'Please select a teret.');
      return;
    }
    setLoading(true);
    // TODO: API call to create byte with title, content, teretId, and teretName
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Success', 'Your byte has been posted!');
      router.replace('/feed');
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Byte</Text>
        <View style={styles.headerPlaceholder} />
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Teret Dropdown */}
        <View style={{ zIndex: 10, marginBottom: 16 }}>
          <DropDownPicker
            open={teretOpen}
            value={selectedTeret}
            items={teretOptions}
            setOpen={setTeretOpen}
            setValue={setSelectedTeret}
            setItems={() => {}}
            placeholder="Select a Teret..."
            searchable={true}
            searchPlaceholder="Search terets..."
            listMode="SCROLLVIEW"
            style={{ borderColor: '#d1d5db', borderRadius: 8 }}
            dropDownContainerStyle={{ borderColor: '#d1d5db', borderRadius: 8 }}
          />
        </View>
        {/* Title Input */}
        <TextInput
          style={[styles.textarea, { minHeight: 48, fontWeight: 'bold', fontSize: 18, marginBottom: 12 }]}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          maxLength={80}
        />
        <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>
          Title must be at least {minTitle} characters
        </Text>
        {/* Content Input */}
        <TextInput
          style={styles.textarea}
          placeholder="What's on your mind?"
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
        />
        <Text style={{ color: '#64748b', fontSize: 12, marginBottom: 8 }}>
          Content must be at least {minPost} characters
        </Text>
        {settingsLoading && (
          <Text style={{ color: '#0ea5e9', marginBottom: 8 }}>Loading post requirements...</Text>
        )}
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

