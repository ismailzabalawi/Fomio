import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import { Block } from '../BlockEditorComponents';
import { useTheme } from '../../../lib/theme/theme';

interface EmbeddedLinkBlockProps {
  block: Block;
  onFocus: () => void;
  onLongPress: () => void;
}

const EmbeddedLinkBlock: React.FC<EmbeddedLinkBlockProps> = ({
  block,
  onFocus,
  onLongPress,
}) => {
  const { theme } = useTheme();
  const url = block.content ?? '';

  const getColors = () => {
    switch (theme) {
      case 'light':
        return { bg: '#F2F2F7', text: '#1C1C1E', domain: '#8E8E93' };
      case 'dark':
        return { bg: '#2C2C2E', text: '#F2F2F2', domain: '#8E8E93' };
      case 'reader':
        return { bg: '#FFF8E1', text: '#2E2C28', domain: '#6E6E6E' };
      default:
        return { bg: '#F2F2F7', text: '#1C1C1E', domain: '#8E8E93' };
    }
  };

  const colors = getColors();
  const domain = url.replace(/^https?:\/\//, '').split('/')[0];

  const getYouTubeThumbnail = () => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
    return match ? `https://img.youtube.com/vi/${match[1]}/0.jpg` : null;
  };

  const thumbnail = getYouTubeThumbnail();

  return (
    <Pressable onLongPress={onLongPress} onFocus={onFocus}>
      <View style={[styles.container, { backgroundColor: colors.bg }]}>
        {thumbnail && <Image source={{ uri: thumbnail }} style={styles.thumbnail} />}
        <View style={styles.textArea}>
          <Text style={[styles.domain, { color: colors.domain }]}>{domain}</Text>
          <Text style={[styles.message, { color: colors.text }]}>Embedded preview coming soon</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginVertical: 12,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 180,
  },
  textArea: {
    padding: 12,
  },
  domain: {
    fontSize: 13,
    marginBottom: 4,
  },
  message: {
    fontSize: 15,
    fontStyle: 'italic',
  },
});

export default EmbeddedLinkBlock;
