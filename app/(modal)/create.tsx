import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
  Keyboard,
  ScrollView,
  KeyboardAvoidingView,
  NativeSyntheticEvent,
  TextInputSelectionChangeEventData,
} from 'react-native';
import { Text } from '@gluestack-ui/themed';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlockEditorProvider, useBlockEditor, TitleInput, BottomToolbar } from '../../components/editor/BlockEditorComponents';
import { useTheme } from '../../lib/theme/theme';
import { Plus, Image, ListBullets, ListNumbers, TextB, TextItalic, Link, TextStrikethrough, Keyboard as KeyboardIcon } from 'phosphor-react-native';

type ThemeMode = 'light' | 'dark' | 'reader';

interface ThemeColors {
  background: string;
  text: string;
  placeholder: string;
  border: string;
  headerBackground: string;
  publishButton: string;
  primary: string;
}

const themeColors: Record<ThemeMode, ThemeColors> = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    placeholder: '#666666',
    border: '#E5E5EA',
    headerBackground: '#FFFFFF',
    publishButton: '#007AFF',
    primary: '#007AFF',
  },
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    placeholder: '#666666',
    border: '#333333',
    headerBackground: '#000000',
    publishButton: '#0A84FF',
    primary: '#0A84FF',
  },
  reader: {
    background: '#F2F2F7',
    text: '#1C1C1E',
    placeholder: '#8E8E93',
    border: '#C6C6C8',
    headerBackground: '#F2F2F7',
    publishButton: '#007AFF',
    primary: '#007AFF',
  },
};

function getThemeColors(mode: string): ThemeColors {
  return themeColors[mode as ThemeMode] || themeColors.light;
}

function Header() {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  
  return (
    <View style={[
      styles.headerContainer, 
      { 
        paddingTop: insets.top,
        backgroundColor: colors.headerBackground,
        borderBottomColor: colors.border,
      }
    ]}>
      <View style={[styles.header, { backgroundColor: colors.headerBackground }]}>
        <TouchableOpacity 
          style={styles.headerButton} 
          onPress={() => router.back()}
        >
          <Text style={[styles.backButton, { color: colors.text }]}>←</Text>
        </TouchableOpacity>
        
        <Text style={[styles.headerTitle, { color: colors.text }]}>Create Post</Text>
        
        <TouchableOpacity 
          style={styles.headerButton}
          onPress={() => {
            console.log('Publishing...');
          }}
        >
          <Text style={[styles.publishButton, { color: colors.publishButton }]}>Publish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const CreateScreen = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = getThemeColors(theme);
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setIsKeyboardVisible(true)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setIsKeyboardVisible(false)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handlePublish = () => {
    console.log('Publishing...');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[
        styles.container,
        {
          backgroundColor: isDark ? 'rgba(0,0,0,0.95)' : 'rgba(255,255,255,0.95)',
        }
      ]}
    >
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[
            styles.headerButton,
            {
              backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            }
          ]}
        >
          <Text style={[styles.headerButtonText, { color: colors.text }]}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handlePublish}
          style={[
            styles.headerButton,
            {
              backgroundColor: colors.primary,
            }
          ]}
        >
          <Text style={[styles.headerButtonText, { color: '#FFFFFF' }]}>Publish</Text>
        </TouchableOpacity>
      </View>
      
      <BlockEditorProvider>
        <ScrollView 
          style={[styles.content, { backgroundColor: colors.background }]} 
          contentContainerStyle={styles.contentContainer}
          keyboardDismissMode="interactive"
        >
          <View style={styles.titleContainer}>
            <TextInput
              style={[styles.titleInput, { color: colors.text }]}
              placeholder="Add title"
              placeholderTextColor={colors.placeholder}
              value={title}
              onChangeText={setTitle}
              multiline={false}
              autoFocus
            />
          </View>
          
          <EditorContent />
        </ScrollView>
      </BlockEditorProvider>

      {isKeyboardVisible && (
        <View style={[styles.bottomToolbar, { 
          backgroundColor: isDark ? 'rgba(20,20,20,0.98)' : 'rgba(240,240,240,0.98)',
          borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          paddingBottom: Math.max(insets.bottom, 4)
        }]}>
          <View style={styles.toolbarContent}>
            <TouchableOpacity style={styles.toolbarButton} onPress={() => console.log('Add block')}>
              <Plus size={20} color={colors.text} weight="regular" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolbarButton} onPress={() => console.log('Add image')}>
              <Image size={20} color={colors.text} weight="regular" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolbarButton} onPress={() => console.log('Add bullet list')}>
              <ListBullets size={20} color={colors.text} weight="regular" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolbarButton} onPress={() => console.log('Add numbered list')}>
              <ListNumbers size={20} color={colors.text} weight="regular" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.toolbarButton} onPress={() => console.log('Bold')}>
              <TextB size={20} color={colors.text} weight="regular" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolbarButton} onPress={() => console.log('Italic')}>
              <TextItalic size={20} color={colors.text} weight="regular" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolbarButton} onPress={() => console.log('Link')}>
              <Link size={20} color={colors.text} weight="regular" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolbarButton} onPress={() => console.log('Strikethrough')}>
              <TextStrikethrough size={20} color={colors.text} weight="regular" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.toolbarButton} onPress={() => Keyboard.dismiss()}>
              <KeyboardIcon size={20} color={colors.text} weight="regular" />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

interface Block {
  id: string;
  type: string;
  content: string | null;
  attributes?: Record<string, any>;
}

function EditorContent() {
  const { blocks, selectedBlockId, addBlock, updateBlock, selectBlock } = useBlockEditor();
  const [content, setContent] = useState('');
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const contentRef = useRef<TextInput>(null);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const insets = useSafeAreaInsets();
  const isDark = theme === 'dark';

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleSelectionChange = (event: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
    const sel = event.nativeEvent.selection;
    setSelection(sel);
    
    // Check for active formats at the current selection
    if (selectedBlockId) {
      const block = blocks.find(b => b.id === selectedBlockId);
      if (block?.attributes?.formats) {
        const formatsAtSelection = block.attributes.formats.filter((format: any) => {
          const formatRange = format.range;
          return formatRange && 
            formatRange.start <= sel.start && 
            formatRange.end >= sel.end;
        });
        setActiveFormats(formatsAtSelection.map((f: any) => f.type));
      }
    }
  };

  const applyFormat = (formatType: string) => {
    if (!selectedBlockId || selection.start === selection.end) return;

    const block = blocks.find(b => b.id === selectedBlockId);
    if (!block) return;

    const currentFormats = block.attributes?.formats || [];
    const formatIndex = currentFormats.findIndex((format: any) => 
      format.type === formatType &&
      format.range.start === selection.start &&
      format.range.end === selection.end
    );

    let newFormats;
    if (formatIndex >= 0) {
      // Remove format if it exists
      newFormats = currentFormats.filter((_: any, i: number) => i !== formatIndex);
    } else {
      // Add new format
      newFormats = [...currentFormats, {
        type: formatType,
        range: { start: selection.start, end: selection.end }
      }];
    }

    updateBlock(selectedBlockId, {
      content,
      attributes: {
        ...block.attributes,
        formats: newFormats
      }
    });
  };

  const handleFormatPress = (format: string) => {
    switch (format) {
      case 'bold':
      case 'italic':
      case 'strikethrough':
        applyFormat(format);
        break;
      case 'link':
        // TODO: Implement link dialog
        console.log('Link format - to be implemented');
        break;
      case 'bulletList':
        updateBlock(selectedBlockId!, {
          type: 'list',
          content,
          attributes: {
            ...blocks.find(b => b.id === selectedBlockId)?.attributes,
            listType: 'bullet'
          }
        });
        break;
      case 'numberedList':
        updateBlock(selectedBlockId!, {
          type: 'list',
          content,
          attributes: {
            ...blocks.find(b => b.id === selectedBlockId)?.attributes,
            listType: 'numbered'
          }
        });
        break;
    }
  };

  const handleAddBlock = () => {
    const newBlockId = Date.now().toString();
    addBlock('paragraph');
    selectBlock(newBlockId);
  };

  const handleAddImage = async () => {
    // TODO: Implement image picker
    console.log('Image upload - to be implemented');
  };

  return (
    <View style={styles.editorContent}>
      <TextInput
        ref={contentRef}
        style={[styles.contentInput, { color: colors.text }]}
        placeholder="What's on your mind?"
        placeholderTextColor={colors.placeholder}
        multiline
        textAlignVertical="top"
        value={content}
        onChangeText={setContent}
        onSelectionChange={handleSelectionChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    borderBottomWidth: 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  headerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  headerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    fontSize: 28,
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  publishButton: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'right',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  titleContainer: {
    marginTop: 8,
  },
  titleInput: {
    fontSize: 32,
    fontWeight: '700',
    padding: 0,
    marginBottom: 8,
  },
  editorContent: {
    marginTop: 16,
  },
  contentInput: {
    fontSize: 17,
    lineHeight: 24,
    padding: 0,
    height: 200,
  },
  bottomToolbar: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 8,
  },
  toolbarContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  toolbarButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  activeButton: {
    backgroundColor: 'rgba(0,122,255,0.1)',
    borderRadius: 16,
  },
});

export default CreateScreen; 