import React from 'react';
import { View, Image, ScrollView, StyleSheet, Pressable, Text } from 'react-native';
import { Block } from '../BlockEditorComponents';
import { useTheme } from '../../../lib/theme/theme';

interface GalleryBlockProps {
  block: Block;
  onFocus: () => void;
  onLongPress: () => void;
}

const GalleryBlock: React.FC<GalleryBlockProps> = ({
  block,
  onFocus,
  onLongPress,
}) => {
  const { theme } = useTheme();

  if (!block.content) {
    return (
      <View style={styles.placeholderContainer}>
        <Text style={styles.placeholderText}>No gallery images</Text>
      </View>
    );
  }

  const imageUrls = block.content.split(',').map(url => url.trim());

  return (
    <Pressable onLongPress={onLongPress} onFocus={onFocus}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
        {imageUrls.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} resizeMode="cover" />
        ))}
      </ScrollView>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginVertical: 12,
    paddingHorizontal: 8,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 8,
  },
  placeholderContainer: {
    height: 120,
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

export default GalleryBlock;
