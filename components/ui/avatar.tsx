import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  style?: ViewStyle;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
  '2xl': 64,
};

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  style,
}: AvatarProps) {
  const avatarSize = sizeMap[size];
  const fontSize = avatarSize * 0.4;

  const containerStyle = [
    styles.container,
    {
      width: avatarSize,
      height: avatarSize,
      borderRadius: avatarSize / 2,
    },
    style,
  ];

  const textStyle: TextStyle = {
    fontSize,
    lineHeight: fontSize * 1.2,
  };

  const fallbackText = fallback || alt?.charAt(0)?.toUpperCase() || 'U';

  return (
    <View style={containerStyle}>
      {src ? (
        <Image
          source={{ uri: src }}
          style={[
            styles.image,
            {
              width: avatarSize,
              height: avatarSize,
              borderRadius: avatarSize / 2,
            },
          ]}
          alt={alt}
        />
      ) : (
        <Text style={[styles.fallbackText, textStyle]}>
          {fallbackText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  fallbackText: {
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
  },
});

