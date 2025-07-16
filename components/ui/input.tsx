import React from 'react';
import {
  TextInput,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
  StyleProp,
} from 'react-native';

export interface InputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoComplete?: 
    | 'additional-name'
    | 'address-line1'
    | 'address-line2'
    | 'birthdate-day'
    | 'birthdate-full'
    | 'birthdate-month'
    | 'birthdate-year'
    | 'cc-csc'
    | 'cc-exp'
    | 'cc-exp-day'
    | 'cc-exp-month'
    | 'cc-exp-year'
    | 'cc-number'
    | 'country'
    | 'current-password'
    | 'email'
    | 'family-name'
    | 'given-name'
    | 'honorific-prefix'
    | 'honorific-suffix'
    | 'name'
    | 'new-password'
    | 'off'
    | 'one-time-code'
    | 'organization'
    | 'organization-title'
    | 'postal-code'
    | 'street-address'
    | 'tel'
    | 'username'
    | 'url';
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'underlined' | 'rounded';
}

export function Input({
  placeholder,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  style,
  inputStyle,
  size = 'md',
  variant = 'outline',
}: InputProps) {
  const getVariantContainerStyle = () => {
    switch (variant) {
      case 'underlined': return styles.underlinedContainer;
      case 'rounded': return styles.roundedContainer;
      default: return styles.outlineContainer;
    }
  };

  const getSizeContainerStyle = () => {
    switch (size) {
      case 'sm': return styles.smContainer;
      case 'lg': return styles.lgContainer;
      default: return styles.mdContainer;
    }
  };

  const getSizeInputStyle = () => {
    switch (size) {
      case 'sm': return styles.smInput;
      case 'lg': return styles.lgInput;
      default: return styles.mdInput;
    }
  };

  const containerStyle: StyleProp<ViewStyle> = [
    styles.container,
    getVariantContainerStyle(),
    getSizeContainerStyle(),
    disabled && styles.disabledContainer,
    style,
  ];

  const textInputStyle: StyleProp<TextStyle> = [
    styles.input,
    getSizeInputStyle(),
    multiline && styles.multilineInput,
    disabled && styles.disabledInput,
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
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
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
    minHeight: 36,
  },
  mdContainer: {
    minHeight: 44,
  },
  lgContainer: {
    minHeight: 52,
  },
  
  // Input styles
  input: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 8,
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
  
  multilineInput: {
    textAlignVertical: 'top',
    minHeight: 80,
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

