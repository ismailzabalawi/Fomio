import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { useTheme } from '../../lib/theme/theme';

interface ScrollIndicatorProps {
  scrollY: Animated.Value;
  contentHeight: number;
  containerHeight: number;
}

export const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({
  scrollY,
  contentHeight,
  containerHeight,
}) => {
  const { theme } = useTheme();
  const [indicatorHeight, setIndicatorHeight] = useState(0);
  const [indicatorY, setIndicatorY] = useState(0);
  const windowHeight = Dimensions.get('window').height;
  
  // Get colors based on theme
  const getIndicatorColor = () => {
    switch (theme) {
      case 'light':
        return 'rgba(142, 142, 147, 0.5)';
      case 'dark':
        return 'rgba(142, 142, 147, 0.5)';
      case 'reader':
        return 'rgba(46, 44, 40, 0.4)';
      default:
        return 'rgba(142, 142, 147, 0.5)';
    }
  };
  
  useEffect(() => {
    if (contentHeight <= containerHeight) {
      setIndicatorHeight(0); // Hide indicator if content fits in container
      return;
    }
    
    // Calculate indicator height based on content and container ratio
    const ratio = containerHeight / contentHeight;
    const calculatedHeight = Math.max(containerHeight * ratio, 30); // Minimum height of 30
    setIndicatorHeight(calculatedHeight);
    
    // Calculate maximum scroll distance
    const maxScrollDistance = contentHeight - containerHeight;
    
    // Calculate maximum indicator travel distance
    const maxIndicatorTravel = containerHeight - calculatedHeight;
    
    // Update indicator position based on scroll
    const indicatorAnimatedValue = scrollY.interpolate({
      inputRange: [0, maxScrollDistance],
      outputRange: [0, maxIndicatorTravel],
      extrapolate: 'clamp',
    });
    
    indicatorAnimatedValue.addListener(({ value }) => {
      setIndicatorY(value);
    });
    
    return () => {
      indicatorAnimatedValue.removeAllListeners();
    };
  }, [scrollY, contentHeight, containerHeight]);
  
  // Don't render if content fits in container
  if (indicatorHeight === 0) {
    return null;
  }
  
  return (
    <View style={styles.container} accessibilityRole="none">
      <Animated.View
        style={[
          styles.indicator,
          {
            height: indicatorHeight,
            transform: [{ translateY: indicatorY }],
            backgroundColor: getIndicatorColor(),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 2,
    top: 0,
    bottom: 0,
    width: 6,
    borderRadius: 3,
  },
  indicator: {
    width: 6,
    borderRadius: 3,
  },
});

export default ScrollIndicator;
