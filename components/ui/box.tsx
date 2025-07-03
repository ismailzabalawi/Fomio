import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

export interface BoxProps extends ViewProps {
  children?: React.ReactNode;
  className?: string;
}

export const Box = React.forwardRef<View, BoxProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <View
        ref={ref}
        className={cn(className)}
        {...props}
      >
        {children}
      </View>
    );
  }
);

Box.displayName = 'Box';
