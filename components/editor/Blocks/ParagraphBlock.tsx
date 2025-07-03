import React, { useCallback, useRef, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useBlockEditor, Block } from '../BlockEditorComponents';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ParagraphBlockProps {
  block: Block;
  onChange: (text: string) => void;
  onFocus: () => void;
  onLongPress: () => void;
}

export const ParagraphBlock: React.FC<ParagraphBlockProps> = ({
  block,
  onChange,
  onFocus,
  onLongPress,
}) => {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);
  const { updateBlock } = useBlockEditor();

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    onFocus();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, []);

  const handleChangeText = useCallback((text: string) => {
    onChange(text);
  }, [onChange]);

  return (
    <View style={[
      styles.container,
      isFocused && styles.containerFocused
    ]}>
      <TouchableOpacity
        style={styles.dragHandle}
        onLongPress={onLongPress}
      >
        <MaterialCommunityIcons name="drag" size={20} color="#666" />
      </TouchableOpacity>
      
      <TextInput
        ref={inputRef}
        value={block.content || ''}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        multiline
        style={styles.input}
        placeholder="Start writing..."
        placeholderTextColor="#666"
        selectionColor="#007AFF"
        keyboardAppearance="dark"
        autoCapitalize="sentences"
        autoCorrect
        textAlignVertical="top"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
    marginVertical: 2,
    borderRadius: 8,
  },
  containerFocused: {
    backgroundColor: '#1c1c1e',
  },
  dragHandle: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#fff',
    padding: 0,
    ...Platform.select({
      ios: {
        paddingTop: 0,
      },
      android: {
        textAlignVertical: 'top',
      },
    }),
  },
});

export default ParagraphBlock;