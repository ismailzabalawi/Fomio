import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { cn } from '../../lib/utils';

export interface TextProps extends RNTextProps {
  children?: React.ReactNode;
  className?: string;
  variant?: 'default' | 'title' | 'subtitle' | 'caption' | 'label';
}

export const Text = React.forwardRef<RNText, TextProps>(
  ({ children, className, variant = 'default', ...props }, ref) => {
    const baseStyles = {
      default: 'text-base text-text-900 dark:text-text-0',
      title: 'text-2xl font-bold text-text-900 dark:text-text-0',
      subtitle: 'text-lg font-semibold text-text-700 dark:text-text-200',
      caption: 'text-sm text-text-500 dark:text-text-400',
      label: 'text-sm font-medium text-text-700 dark:text-text-300',
    };

    return (
      <RNText
        ref={ref}
        className={cn(baseStyles[variant], className)}
        {...props}
      >
        {children}
      </RNText>
    );
  }
);

Text.displayName = 'Text';
