import React, { useRef } from 'react';
import { TextInput, Pressable, StyleSheet } from 'react-native';
import { Block } from '../BlockEditorComponents';
import { useTheme } from '../../../lib/theme/theme';

interface HeadingBlockProps {
  block: Block;
  onChange: (text: string) => void;
  onFocus: () => void;
  onLongPress: () => void;
}

const HeadingBlock: React.FC<HeadingBlockProps> = ({
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
        return { text: '#000', placeholder: '#888' };
      case 'dark':
        return { text: '#fff', placeholder: '#aaa' };
      case 'reader':
        return { text: '#333', placeholder: '#777' };
      default:
        return { text: '#000', placeholder: '#888' };
    }
  };

  const colors = getColors();

  return (
    <Pressable onLongPress={onLongPress}>
      <TextInput
        ref={inputRef}
        style={[styles.heading, { color: colors.text }]}
        placeholder="Enter your heading here..."
        placeholderTextColor={colors.placeholder}
        multiline
        value={block.content ?? ''}
        onChangeText={(text) => onChange(text)}
        onFocus={onFocus}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  heading: {
    fontSize: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontWeight: '700',
  },
});

export default HeadingBlock;