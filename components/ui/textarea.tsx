import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';

export interface TextareaProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'underlined' | 'rounded';
  numberOfLines?: number;
  maxLength?: number;
}

export function Textarea({
  placeholder,
  value,
  onChangeText,
  disabled = false,
  style,
  inputStyle,
  size = 'md',
  variant = 'outline',
  numberOfLines = 4,
  maxLength,
}: TextareaProps) {
  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    styles[`${variant}Container` as keyof typeof styles] as ViewStyle,
    styles[`${size}Container` as keyof typeof styles] as ViewStyle,
    disabled ? styles.disabledContainer : undefined,
    style,
  ];

  const textInputStyle: StyleProp<TextStyle> = [
    styles.input,
    styles[`${size}Input` as keyof typeof styles] as TextStyle,
    disabled ? styles.disabledInput : undefined,
    inputStyle,
  ];

  return (
    <View style={containerStyle}>
      <TextInput
        style={textInputStyle}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
        editable={!disabled}
        multiline
        numberOfLines={numberOfLines}
        textAlignVertical="top"
        maxLength={maxLength}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },

  // Variant styles
  outlineContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#ffffff',
  },
  underlinedContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    backgroundColor: 'transparent',
  },
  roundedContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },

  // Size styles
  smContainer: {
    minHeight: 80,
  },
  mdContainer: {
    minHeight: 100,
  },
  lgContainer: {
    minHeight: 120,
  },

  // Input styles
  input: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
    textAlignVertical: 'top',
  },

  // Size input styles
  smInput: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  mdInput: {
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  lgInput: {
    fontSize: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  // Disabled styles
  disabledContainer: {
    backgroundColor: '#f9fafb',
    borderColor: '#e5e7eb',
  },
  disabledInput: {
    color: '#9ca3af',
  },
});
