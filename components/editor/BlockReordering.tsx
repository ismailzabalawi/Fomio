import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableOpacity,
  Vibration,
} from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import { Block, useBlockEditor } from './BlockEditorComponents';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface BlockReorderingWrapperProps {
  id: string;
  isSelected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}

export const BlockReorderingWrapper: React.FC<BlockReorderingWrapperProps> = ({
  id,
  isSelected,
  onSelect,
  children,
}) => {
  const { theme } = useTheme();
  const { blocks, moveBlock } = useBlockEditor();
  const [isDragging, setIsDragging] = useState(false);
  const [isLongPressed, setIsLongPressed] = useState(false);
  const pan = useRef(new Animated.ValueXY()).current;
  const blockHeight = useRef(0);
  const blockIndex = blocks.findIndex((block) => block.id === id);

  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          selectedBorder: '#007AFF',
          dragIndicator: '#8E8E93',
          dragShadow: 'rgba(0, 0, 0, 0.15)',
          background: '#FFFFFF',
        };
      case 'dark':
        return {
          selectedBorder: '#0A84FF',
          dragIndicator: '#8E8E93',
          dragShadow: 'rgba(0, 0, 0, 0.3)',
          background: '#1C1C1E',
        };
      case 'reader':
        return {
          selectedBorder: '#2E2C28',
          dragIndicator: '#6C6A67',
          dragShadow: 'rgba(46, 44, 40, 0.15)',
          background: '#FAF4E6',
        };
      default:
        return {
          selectedBorder: '#0A84FF',
          dragIndicator: '#8E8E93',
          dragShadow: 'rgba(0, 0, 0, 0.3)',
          background: '#000000',
        };
    }
  };

  const colors = getColors();

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return isLongPressed && (Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5);
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        pan.extractOffset(); // ✅ built-in method
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();
        setIsDragging(false);
        setIsLongPressed(false);

        const moveDistance = Math.round(gestureState.dy / blockHeight.current);

        if (moveDistance !== 0) {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          const newIndex = blockIndex + moveDistance;
          if (newIndex >= 0 && newIndex < blocks.length) {
            for (let i = 0; i < Math.abs(moveDistance); i++) {
              moveBlock(id, moveDistance > 0 ? 'down' : 'up');
            }
          }
        }

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5,
        }).start();
      },
    })
  ).current;

  const handleLongPress = () => {
    Vibration.vibrate(50);
    setIsLongPressed(true);
    onSelect();
  };

  return (
    <Animated.View
      style={[
        styles.blockWrapper,
        isDragging && {
          zIndex: 999,
          elevation: 5,
          shadowColor: colors.dragShadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 5,
        },
        {
          transform: [
            { translateX: pan.x },
            { translateY: pan.y },
            ...(isDragging ? [{ scale: 0.97 }] : []),
          ],
        },
      ]}
      onLayout={(event) => {
        blockHeight.current = event.nativeEvent.layout.height;
      }}
      {...panResponder.panHandlers}
    >
      <View style={{ position: 'relative' }}>
        {isSelected && (
          <View style={styles.dragHandleContainer}>
            <View style={[styles.dragHandle, { backgroundColor: colors.dragIndicator }]} />
            <View style={[styles.dragHandle, { backgroundColor: colors.dragIndicator }]} />
            <View style={[styles.dragHandle, { backgroundColor: colors.dragIndicator }]} />
          </View>
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onSelect}
          onLongPress={handleLongPress}
          delayLongPress={300}
          style={[
            styles.blockContainer,
            isSelected && { borderColor: colors.selectedBorder, borderWidth: 1 },
            { backgroundColor: colors.background },
          ]}
        >
          {children}
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  blockWrapper: {
    marginVertical: 6,
  },
  blockContainer: {
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  dragHandleContainer: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: [{ translateY: -12 }],
    paddingVertical: 12,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  dragHandle: {
    width: 20,
    height: 2,
    borderRadius: 1,
    marginVertical: 2,
  },
});