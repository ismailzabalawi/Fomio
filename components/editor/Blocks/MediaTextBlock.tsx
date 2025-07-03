import React, { useRef } from 'react';
import { View, TextInput, Image, StyleSheet, Pressable } from 'react-native';
import { Block } from '../BlockEditorComponents';
import { useTheme } from '../../../lib/theme/theme';

interface MediaTextBlockProps {
  block: Block;
  onChange: (text: string) => void;
  onFocus: () => void;
  onLongPress: () => void;
}

const MediaTextBlock: React.FC<MediaTextBlockProps> = ({
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
        return { text: '#1C1C1E', placeholder: '#8E8E93', bg: '#fff' };
      case 'dark':
        return { text: '#F2F2F2', placeholder: '#8E8E93', bg: '#1C1C1E' };
      case 'reader':
        return { text: '#2E2C28', placeholder: '#6C6A67', bg: '#FAF4E8' };
      default:
        return { text: '#F2F2F2', placeholder: '#8E8E93', bg: '#fff' };
    }
  };

  const colors = getColors();
  const [imageUri, ...textParts] = (block.content ?? '').split('\n');
  const textContent = textParts.join('\n');

  return (
    <Pressable onLongPress={onLongPress}>
      <View style={styles.container}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
        <TextInput
          ref={inputRef}
          style={[styles.textInput, { color: colors.text }]}
          placeholder="Write here..."
          placeholderTextColor={colors.placeholder}
          multiline
          value={textContent}
          onChangeText={(text) => onChange(`${imageUri}\n${text}`)}
          onFocus={onFocus}
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    padding: 12,
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
  },
});

export default MediaTextBlock;
