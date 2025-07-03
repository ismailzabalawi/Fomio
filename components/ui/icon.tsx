import React from 'react';
import { View, ViewProps } from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import type { IconProps as PhosphorIconProps } from 'phosphor-react-native';
import type { IconWeight } from 'phosphor-react-native';

interface IconProps extends Omit<ViewProps, 'children'> {
  as: React.ComponentType<PhosphorIconProps>;
  size?: 'sm' | 'md' | 'lg' | number;
  color?: string;
  weight?: IconWeight;
  className?: string;
  mirrored?: boolean;
}

const sizeMap = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

// Memoize common icon sizes for better performance
const memoizedSizes = new Map<string | number, number>();

function getIconSize(size: IconProps['size']): number {
  if (size == null) return sizeMap.md;
  
  const sizeKey = size.toString();
  if (memoizedSizes.has(sizeKey)) {
    return memoizedSizes.get(sizeKey)!;
  }

  const computedSize = typeof size === 'string' ? sizeMap[size] ?? sizeMap.md : size;
  memoizedSizes.set(sizeKey, computedSize);
  return computedSize;
}

export const Icon = React.forwardRef<View, IconProps>((props, ref) => {
  const {
    as: IconComponent,
    size = 'md',
    color,
    weight = 'regular',
    className,
    style,
    mirrored = false,
    ...rest
  } = props;

  const { theme } = useTheme();
  
  const iconSize = React.useMemo(() => getIconSize(size), [size]);
  const iconColor = color || (theme === 'dark' ? '#E1E1E6' : '#1A1A1A');

  return (
    <View 
      ref={ref}
      className={`items-center justify-center ${className || ''}`}
      style={[
        style,
        mirrored && { transform: [{ scaleX: -1 }] }
      ]}
      {...rest}
    >
      <IconComponent 
        size={iconSize} 
        color={iconColor}
        weight={weight}
      />
    </View>
  );
});

Icon.displayName = 'Icon';

// Export types for better TypeScript support
export type { IconProps };
export type { IconWeight };
