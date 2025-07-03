import React from 'react';
import { useColorScheme } from 'react-native';
import * as PhosphorIcons from 'phosphor-react-native';
import type { IconProps } from 'phosphor-react-native';

export interface PhosphorIconProps {
  name: keyof typeof PhosphorIcons;
  size?: number;
  weight?: 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone';
  color?: string;
}

export function PhosphorIcon({
  name,
  size = 24,
  weight = 'regular',
  color,
}: PhosphorIconProps) {
  const colorScheme = useColorScheme();
  const IconComponent = PhosphorIcons[name] as React.FC<IconProps>;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Phosphor Icons`);
    return null;
  }

  return (
    <IconComponent
      size={size}
      weight={weight}
      color={color || (colorScheme === 'dark' ? '#FFFFFF' : '#000000')}
    />
  );
} 