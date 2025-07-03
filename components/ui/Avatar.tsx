import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import { User } from 'phosphor-react-native';

interface AvatarProps {
  size?: 'sm' | 'md' | 'lg';
  bgColor?: string;
  className?: string;
  children?: React.ReactNode;
  source?: ImageSourcePropType;
  fallback?: React.ReactNode;
}

interface AvatarFallbackTextProps {
  children: React.ReactNode;
  className?: string;
}

const sizeStyles = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base'
} as const;

const iconSizes = {
  sm: 20,
  md: 24,
  lg: 28,
} as const;

const AvatarFallbackText = React.forwardRef<Text, AvatarFallbackTextProps>((props, ref) => {
  const { children, className } = props;
  return (
    <Text
      ref={ref}
      className={`text-center text-gray-900 dark:text-gray-100 font-medium ${className || ''}`}
      numberOfLines={1}
    >
      {children}
    </Text>
  );
});

AvatarFallbackText.displayName = 'Avatar.FallbackText';

const AvatarImage = React.forwardRef<Image, { source: ImageSourcePropType, className?: string }>((props, ref) => {
  const { source, className } = props;
  return (
    <Image
      ref={ref}
      source={source}
      className={`w-full h-full ${className || ''}`}
      resizeMode="cover"
    />
  );
});

AvatarImage.displayName = 'Avatar.Image';

const AvatarFallbackIcon = React.forwardRef<View, { size: keyof typeof sizeStyles }>((props, ref) => {
  const { size } = props;
  const { theme } = useTheme();
  
  return (
    <View ref={ref} className="items-center justify-center">
      <User 
        size={iconSizes[size]}
        color={theme === 'dark' ? '#E1E1E6' : '#1A1A1A'}
        weight="thin"
      />
    </View>
  );
});

AvatarFallbackIcon.displayName = 'Avatar.FallbackIcon';

const AvatarComponent = React.forwardRef<View, AvatarProps>((props, ref) => {
  const { 
    size = 'md', 
    bgColor, 
    className, 
    children, 
    source,
    fallback 
  } = props;
  
  const { theme } = useTheme();

  return (
    <View
      ref={ref}
      className={`
        rounded-full justify-center items-center overflow-hidden
        ${sizeStyles[size]}
        ${bgColor ? `bg-[${bgColor}]` : 'bg-gray-200 dark:bg-gray-700'}
        ${className || ''}
      `}
    >
      {source ? (
        <AvatarImage source={source} />
      ) : children ? (
        children
      ) : fallback ? (
        fallback
      ) : (
        <AvatarFallbackIcon size={size} />
      )}
    </View>
  );
});

AvatarComponent.displayName = 'Avatar';

export const Avatar = Object.assign(AvatarComponent, {
  FallbackText: AvatarFallbackText,
  Image: AvatarImage,
  FallbackIcon: AvatarFallbackIcon
});

export type { AvatarProps };
