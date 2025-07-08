import React from 'react';
import { Button as GluestackButton, ButtonText, ButtonSpinner } from '@gluestack-ui/themed';

export interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  children,
  onPress,
  disabled = false,
  loading = false,
  className,
  ...props
}: ButtonProps) {
  return (
    <GluestackButton
      onPress={onPress}
      isDisabled={disabled || loading}
      className={className}
      {...props}
    >
      {loading && <ButtonSpinner />}
      <ButtonText>{children}</ButtonText>
    </GluestackButton>
  );
}

