import React, { useState, useContext, createContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PlusCircle, TextB, TextItalic, Link, Image } from 'phosphor-react-native';

// -------------------------------------------
// TYPES
// -------------------------------------------

export type BlockType =
  | 'paragraph'
  | 'heading'
  | 'image'
  | 'gallery'
  | 'list'
  | 'quote'
  | 'separator'
  | 'pageBreak'
  | 'mediaText'
  | 'embed'
  | 'video'
  | 'embed'
  | 'code';

export interface Block {
  id: string;
  type: BlockType;
  content: string | null;
  attributes?: Record<string, any>;
}

type ThemeMode = 'light' | 'dark' | 'reading';

interface ThemeColors {
  background: string;
  text: string;
  secondaryText: string;
  border: string;
}

const themeColors: Record<ThemeMode, ThemeColors> = {
  light: {
    background: '#FFFFFF',
    text: '#000000',
    secondaryText: '#8E8E93',
    border: '#E5E5EA',
  },
  dark: {
    background: '#000000',
    text: '#FFFFFF',
    secondaryText: '#8E8E93',
    border: '#2C2C2E',
  },
  reading: {
    background: '#FAF4E6',
    text: '#2E2C28',
    secondaryText: '#6C6A67',
    border: '#D8CCAF',
  },
};

function getThemeColors(mode: string): ThemeColors {
  return themeColors[mode as ThemeMode] || themeColors.light;
}

// -------------------------------------------
// CONTEXT
// -------------------------------------------

interface BlockEditorContextType {
  blocks: Block[];
  selectedBlockId: string | null;
  addBlock: (type: BlockType, index?: number) => void;
  insertBlock: (type: BlockType, index?: number) => void;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  deleteBlock: (id: string) => void;
  moveBlock: (id: string, direction: 'up' | 'down') => void;
  selectBlock: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
}

const BlockEditorContext = createContext<BlockEditorContextType | undefined>(undefined);

export const useBlockEditor = () => {
  const context = useContext(BlockEditorContext);
  if (!context) {
    throw new Error('useBlockEditor must be used within a BlockEditorProvider');
  }
  return context;
};

interface BlockEditorProviderProps {
  children: React.ReactNode;
  initialBlocks?: Block[];
}

export const BlockEditorProvider: React.FC<BlockEditorProviderProps> = ({
  children,
  initialBlocks = [{ id: '1', type: 'paragraph', content: '' }],
}) => {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  const addBlock = (type: BlockType, index?: number) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: type === 'paragraph' || type === 'heading' ? '' : null,
    };
    const newBlocks = [...blocks];
    if (index !== undefined) {
      newBlocks.splice(index + 1, 0, newBlock);
    } else {
      newBlocks.push(newBlock);
    }
    setBlocks(newBlocks);
    setSelectedBlockId(newBlock.id);
  };

  const insertBlock = (type: BlockType, index?: number) => {
    addBlock(type, index);
  };

  const updateBlock = (id: string, updates: Partial<Block>) => {
    const newBlocks = blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    );
    setBlocks(newBlocks);
  };

  const deleteBlock = (id: string) => {
    if (blocks.length <= 1) return;
    const newBlocks = blocks.filter(block => block.id !== id);
    setBlocks(newBlocks);
    setSelectedBlockId(null);
  };

  const moveBlock = (id: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(block => block.id === id);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const newBlocks = [...blocks];
    const [moved] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, moved);
    setBlocks(newBlocks);
  };

  const selectBlock = (id: string | null) => {
    setSelectedBlockId(id);
  };

  const undo = () => {}; // TODO: future implementation
  const redo = () => {}; // TODO: future implementation

  return (
    <BlockEditorContext.Provider
      value={{
        blocks,
        selectedBlockId,
        addBlock,
        insertBlock,
        updateBlock,
        deleteBlock,
        moveBlock,
        selectBlock,
        undo,
        redo,
      }}
    >
      {children}
    </BlockEditorContext.Provider>
  );
};

// -------------------------------------------
// COMPONENTS
// -------------------------------------------

export const BlockEditorHeader: React.FC<{
  title: string;
  onBack: () => void;
  onPublish: () => void;
}> = ({ title, onBack, onPublish }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const textColor = theme === 'dark' ? '#F2F2F2' : '#1C1C1E';

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <TouchableOpacity onPress={onBack}>
        <Text style={[styles.headerButton, { color: textColor }]}>←</Text>
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: textColor }]}>{title}</Text>
      <TouchableOpacity onPress={onPublish}>
        <Text style={[styles.headerButton, { color: '#0A84FF' }]}>Publish</Text>
      </TouchableOpacity>
    </View>
  );
};

export const TitleInput: React.FC<{
  value: string;
  onChangeText: (text: string) => void;
}> = ({ value, onChangeText }) => {
  const { theme } = useTheme();
  return (
    <TextInput
      style={[
        styles.titleInput,
        { color: theme === 'dark' ? '#F2F2F2' : '#1C1C1E' },
      ]}
      value={value}
      onChangeText={onChangeText}
      placeholder="Add title"
      placeholderTextColor="#8E8E93"
      multiline
    />
  );
};

export const BlockPlaceholder: React.FC<{ onPress: () => void }> = ({
  onPress,
}) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.placeholder}>
      <Text style={styles.placeholderText}>ADD BLOCK HERE</Text>
    </TouchableOpacity>
  );
};

export const BottomToolbar: React.FC<{
  onAddBlock: () => void;
  onFormatBold: () => void;
  onFormatItalic: () => void;
  onFormatLink: () => void;
  onInsertMedia: () => void;
}> = ({
  onAddBlock,
  onFormatBold,
  onFormatItalic,
  onFormatLink,
  onInsertMedia,
}) => {
  const { theme } = useTheme();
  const colors = getThemeColors(theme);
  
  return (
    <View
      style={[
        styles.bottomToolbar,
        { backgroundColor: theme === 'dark' ? '#1C1C1E' : '#F2F2F7' },
      ]}
    >
      <TouchableOpacity onPress={onAddBlock}>
        <PlusCircle size={24} color={colors.text} weight="regular" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onFormatBold}>
        <TextB size={24} color={colors.text} weight="regular" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onFormatItalic}>
        <TextItalic size={24} color={colors.text} weight="regular" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onFormatLink}>
        <Link size={24} color={colors.text} weight="regular" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onInsertMedia}>
        <Image size={24} color={colors.text} weight="regular" />
      </TouchableOpacity>
    </View>
  );
};

// -------------------------------------------
// STYLES
// -------------------------------------------

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 8,
    justifyContent: 'space-between',
  },
  headerButton: {
    fontSize: 24,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  titleInput: {
    fontSize: 26,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  placeholder: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginVertical: 16,
    marginHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    borderColor: '#8E8E93',
  },
  placeholderText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
  bottomToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: '#8E8E93',
  },
  toolbarIcon: {
    fontSize: 18,
    color: '#0A84FF',
  },
});