import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Block } from '../BlockEditorComponents';
import { useTheme } from '../../../lib/theme/theme';

interface PageBreakBlockProps {
  block: Block;
  onFocus: () => void;
  onLongPress: () => void;
}

const PageBreakBlock: React.FC<PageBreakBlockProps> = ({
  onFocus,
  onLongPress,
}) => {
  const { theme } = useTheme();

  const getStyles = () => {
    switch (theme) {
      case 'light':
        return { color: '#6e6e73', border: '#d1d1d6' };
      case 'dark':
        return { color: '#b0b0b0', border: '#3a3a3c' };
      case 'reader':
        return { color: '#5e5e5e', border: '#c7c7c7' };
      default:
        return { color: '#6e6e73', border: '#d1d1d6' };
    }
  };

  const colors = getStyles();

  return (
    <Pressable onLongPress={onLongPress} onFocus={onFocus}>
      <View style={[styles.line, { borderBottomColor: colors.border }]}>
        <Text style={[styles.label, { color: colors.color }]}>Page Break</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  line: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    marginVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    marginTop: -10,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    fontSize: 12,
    fontStyle: 'italic',
  },
});

export default PageBreakBlock;
