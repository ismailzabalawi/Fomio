// Base Block Component
import React, { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import { useBlockEditor } from './BlockEditorComponents';

interface BaseBlockProps {
  id: string;
  isSelected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}

export const BaseBlock: React.FC<BaseBlockProps> = ({
  id,
  isSelected,
  onSelect,
  children,
}) => {
  const { theme } = useTheme();
  const { deleteBlock, moveBlock } = useBlockEditor();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Animate scale when selected
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isSelected ? 0.97 : 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  }, [isSelected]);

  const colors = useMemo(() => {
    switch (theme) {
      case 'light':
        return {
          selectedBorder: '#007AFF',
          controlsBg: 'rgba(242, 242, 247, 0.9)',
          controlsText: '#1C1C1E',
        };
      case 'dark':
        return {
          selectedBorder: '#0A84FF',
          controlsBg: 'rgba(28, 28, 30, 0.9)',
          controlsText: '#F2F2F2',
        };
      case 'reader':
        return {
          selectedBorder: '#2E2C28',
          controlsBg: 'rgba(245, 236, 215, 0.9)',
          controlsText: '#2E2C28',
        };
      default:
        return {
          selectedBorder: '#0A84FF',
          controlsBg: 'rgba(28, 28, 30, 0.9)',
          controlsText: '#F2F2F2',
        };
    }
  }, [theme]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onSelect}
        style={[
          styles.blockContainer,
          isSelected && { borderColor: colors.selectedBorder, borderWidth: 1 },
        ]}
      >
        {children}

        {isSelected && (
          <View style={[styles.blockControls, { backgroundColor: colors.controlsBg }]}>
            <TouchableOpacity
              onPress={() => moveBlock(id, 'up')}
              style={styles.blockControlButton}
              accessibilityLabel="Move block up"
            >
              <Text style={[styles.blockControlIcon, { color: colors.controlsText }]}>↑</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => moveBlock(id, 'down')}
              style={styles.blockControlButton}
              accessibilityLabel="Move block down"
            >
              <Text style={[styles.blockControlIcon, { color: colors.controlsText }]}>↓</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => deleteBlock(id)}
              style={styles.blockControlButton}
              accessibilityLabel="Delete block"
            >
              <Text style={[styles.blockControlIcon, { color: colors.controlsText }]}>🗑️</Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

// Styles (these can stay where they are if shared with other blocks)
const styles = StyleSheet.create({
  blockContainer: {
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    borderWidth: 0,
    overflow: 'hidden',
  },
  blockControls: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  blockControlButton: {
    padding: 8,
    marginLeft: 8,
  },
  blockControlIcon: {
    fontSize: 16,
  },
});