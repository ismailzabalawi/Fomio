import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Block } from '../BlockEditorComponents';
import { useTheme } from '../../../lib/theme/theme';

interface SeparatorBlockProps {
  block: Block;
  onFocus: () => void;
  onLongPress: () => void;
}

const SeparatorBlock: React.FC<SeparatorBlockProps> = ({
  onFocus,
  onLongPress,
}) => {
  const { theme } = useTheme();

  const getBorderColor = () => {
    switch (theme) {
      case 'light':
        return '#C8C7CC';
      case 'dark':
        return '#3A3A3C';
      case 'reader':
        return '#A9A9A9';
      default:
        return '#C8C7CC';
    }
  };

  return (
    <View style={[styles.separator, { borderBottomColor: getBorderColor() }]} />
  );
};

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    marginVertical: 12,
    marginHorizontal: 16,
  },
});

export default SeparatorBlock;
