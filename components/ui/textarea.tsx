import React from 'react';
import { Textarea as GluestackTextarea, TextareaInput } from '@gluestack-ui/themed';

export interface TextareaProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  disabled?: boolean;
  className?: string;
  numberOfLines?: number;
}

export function Textarea({
  placeholder,
  value,
  onChangeText,
  disabled = false,
  className,
  numberOfLines = 4,
  ...props
}: TextareaProps) {
  return (
    <GluestackTextarea
      isDisabled={disabled}
      className={className}
      {...props}
    >
      <TextareaInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        numberOfLines={numberOfLines}
        multiline
      />
    </GluestackTextarea>
  );
}

