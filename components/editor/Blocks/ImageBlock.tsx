import React from 'react';
import { Image, View, StyleSheet, Pressable, Text } from 'react-native';
import { Block } from '../BlockEditorComponents';
import { useTheme } from '../../../lib/theme/theme';

interface ImageBlockProps {
  block: Block;
  onFocus: () => void;
  onLongPress: () => void;
}

const ImageBlock: React.FC<ImageBlockProps> = ({
  block,
  onFocus,
  onLongPress,
}) => {
  const { theme } = useTheme();

  if (!block.content) {
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>No image</Text>
      </View>
    );
  }

  return (
    <Pressable onLongPress={onLongPress} onFocus={onFocus}>
      <Image source={{ uri: block.content }} style={styles.image} resizeMode="cover" />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 12,
  },
  placeholderContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee',
    marginVertical: 12,
    borderRadius: 10,
  },
  placeholderText: {
    color: '#999',
  },
});

export default ImageBlock;
