import React, { useRef } from 'react';
import { TextInput, Pressable, StyleSheet } from 'react-native';
import { Block } from '../BlockEditorComponents';
import { useTheme } from '../../../lib/theme/theme';

interface QuoteBlockProps {
  block: Block;
  onChange: (text: string) => void;
  onFocus: () => void;
  onLongPress: () => void;
}

const QuoteBlock: React.FC<QuoteBlockProps> = ({
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
        return { text: '#555', placeholder: '#aaa', border: '#ddd' };
      case 'dark':
        return { text: '#ccc', placeholder: '#555', border: '#444' };
      case 'reader':
        return { text: '#3a3a3a', placeholder: '#888', border: '#ccc' };
      default:
        return { text: '#555', placeholder: '#aaa', border: '#ddd' };
    }
  };

  const colors = getColors();

  return (
    <Pressable onLongPress={onLongPress}>
      <TextInput
        ref={inputRef}
        style={[
          styles.quote,
          {
            color: colors.text,
            borderLeftColor: colors.border,
          },
        ]}
        placeholder="Enter your quote here..."
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
  quote: {
    fontStyle: 'italic',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderLeftWidth: 4,
  },
});

export default QuoteBlock;