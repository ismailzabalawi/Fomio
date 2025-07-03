import React, { useRef } from 'react';
import { TextInput, Pressable, StyleSheet } from 'react-native';
import { Block } from '../BlockEditorComponents';
import { useTheme } from '../../../lib/theme/theme';

interface ListBlockProps {
  block: Block;
  onChange: (text: string) => void;
  onFocus: () => void;
  onLongPress: () => void;
}

const ListBlock: React.FC<ListBlockProps> = ({
  block,
  onChange,
  onFocus,
  onLongPress,
}) => {
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);

  const getColors = () => {
    switch (theme) {
      case 'light':
        return { text: '#1C1C1E', placeholder: '#8E8E93' };
      case 'dark':
        return { text: '#F2F2F2', placeholder: '#8E8E93' };
      case 'reader':
        return { text: '#2E2C28', placeholder: '#6C6A67' };
      default:
        return { text: '#F2F2F2', placeholder: '#8E8E93' };
    }
  };

  const colors = getColors();

  return (
    <Pressable onLongPress={onLongPress}>
      <TextInput
        ref={inputRef}
        style={[styles.input, { color: colors.text }]}
        placeholder="• List item"
        placeholderTextColor={colors.placeholder}
        multiline
        value={block.content ?? ''}
        onChangeText={onChange}
        onFocus={onFocus}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  input: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});

export default ListBlock;
