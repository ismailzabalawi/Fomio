import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

export interface StackProps extends ViewProps {
  children?: React.ReactNode;
  className?: string;
  space?: number;
}

export const HStack = React.forwardRef<View, StackProps>(
  ({ children, className, space = 2, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn('flex-row', `space-x-${space}`, className)}
        {...props}
      >
        {children}
      </View>
    );
  }
);

export const VStack = React.forwardRef<View, StackProps>(
  ({ children, className, space = 2, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn('flex-col', `space-y-${space}`, className)}
        {...props}
      >
        {children}
      </View>
    );
  }
);

HStack.displayName = 'HStack';
VStack.displayName = 'VStack';
