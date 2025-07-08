import React from 'react';
import { Switch as GluestackSwitch } from '@gluestack-ui/themed';

export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export function Switch({
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
  ...props
}: SwitchProps) {
  return (
    <GluestackSwitch
      value={checked}
      onValueChange={onCheckedChange}
      isDisabled={disabled}
      className={className}
      {...props}
    />
  );
}

