import React from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, TextInputProps } from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import type { IconProps as PhosphorIconProps } from 'phosphor-react-native';
import { cn } from '../../lib/utils/cn';

// Types
interface InputBaseProps {
  className?: string;
  inputClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'filled' | 'unstyled';
  isDisabled?: boolean;
  isInvalid?: boolean;
  isReadOnly?: boolean;
}

interface InputProps extends Omit<TextInputProps, 'style'>, InputBaseProps {
  style?: TextInputProps['style'];
  leftIcon?: {
    Icon: React.ComponentType<PhosphorIconProps>;
    props?: Partial<PhosphorIconProps>;
  };
  rightIcon?: {
    Icon: React.ComponentType<PhosphorIconProps>;
    props?: Partial<PhosphorIconProps>;
  };
}

interface InputFieldProps extends React.ComponentProps<typeof TextInput> {
  className?: string;
}

interface InputSlotProps extends React.ComponentProps<typeof View> {
  className?: string;
}

interface InputIconProps {
  as: React.ComponentType<any>;
  size?: number;
  color?: string;
  [key: string]: any;
}

interface IconConfig {
  icon: React.ComponentType<PhosphorIconProps>;
  props?: Partial<PhosphorIconProps>;
}

const sizeStyles = {
  sm: {
    height: 32,
    fontSize: 14,
    padding: 8,
  },
  md: {
    height: 40,
    fontSize: 16,
    padding: 12,
  },
  lg: {
    height: 48,
    fontSize: 18,
    padding: 16,
  },
} as const;

// Input Container Component
export const Input = React.forwardRef<TextInput, InputProps>((props, ref) => {
  const {
    leftIcon,
    rightIcon,
    className,
    inputClassName,
    size = 'md',
    variant = 'outline',
    isDisabled,
    isInvalid,
    isReadOnly,
    style,
    ...rest
  } = props;

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return 'bg-gray-100 dark:bg-gray-800 border-transparent';
      case 'unstyled':
        return 'bg-transparent border-transparent';
      default:
        return 'bg-transparent border-gray-200 dark:border-gray-700';
    }
  };

  const getStateStyles = () => {
    if (isDisabled) return 'opacity-50';
    if (isInvalid) return 'border-red-500 dark:border-red-400';
    return '';
  };

  const getSizeStyles = () => {
    const { height, fontSize, padding } = sizeStyles[size];
    return {
      container: `h-[${height}px]`,
      input: `text-[${fontSize}px] px-[${padding}px]`
    };
  };

  const { container: containerSize, input: inputSize } = getSizeStyles();

  const getIconColor = () => {
    return isDark ? '#E1E1E6' : '#1A1A1A';
  };

  return (
    <View
      className={cn(
        'flex-row items-center rounded-lg border',
        getVariantStyles(),
        getStateStyles(),
        containerSize,
        className
      )}
    >
      {leftIcon && (
        <View className="mr-2">
          <leftIcon.Icon 
            size={20}
            color={getIconColor()}
            weight="regular"
            {...leftIcon.props}
          />
        </View>
      )}
      
      <TextInput
        ref={ref}
        className={cn(
          'flex-1 h-full',
          'text-gray-900 dark:text-gray-100',
          'placeholder:text-gray-500 dark:placeholder:text-gray-400',
          isDisabled && 'opacity-50',
          inputSize,
          inputClassName
        )}
        style={style}
        editable={!isDisabled && !isReadOnly}
        placeholderTextColor={isDark ? '#666' : '#999'}
        selectionColor={isDark ? '#E1E1E6' : '#1A1A1A'}
        {...rest}
      />
      
      {rightIcon && (
        <View className="ml-2">
          <rightIcon.Icon 
            size={20}
            color={getIconColor()}
            weight="regular"
            {...rightIcon.props}
          />
        </View>
      )}
    </View>
  );
});

Input.displayName = 'Input';

// Input Field Component
export const InputField = React.forwardRef<TextInput, InputFieldProps>((props, ref) => {
  const { className, style, ...rest } = props;
  const { theme } = useTheme();
  
  return (
    <TextInput
      ref={ref}
      style={[styles.input, style]}
      className={className}
      placeholderTextColor={theme === 'dark' ? '#666' : '#999'}
      {...rest}
    />
  );
});

// Input Slot Component (for icons/buttons)
export const InputSlot = React.forwardRef<View, InputSlotProps>((props, ref) => {
  const { className, style, children, ...rest } = props;
  return (
    <View
      ref={ref}
      style={[styles.slot, style]}
      className={className}
      {...rest}
    >
      {children}
    </View>
  );
});

// Input Icon Component
export const InputIcon = ({ as: Icon, size = 20, color, ...props }: InputIconProps) => {
  const { theme } = useTheme();
  const iconColor = color || (theme === 'dark' ? '#E1E1E6' : '#1A1A1A');
  
  return <Icon size={size} color={iconColor} {...props} />;
};

// Theme colors helper
const getThemeColors = (theme: string) => {
  switch (theme) {
    case 'dark':
      return {
        background: '#1C1C1E',
        border: '#38383A',
        text: '#F2F2F2',
        placeholder: '#636366',
      };
    case 'reader':
      return {
        background: '#FAF4E6',
        border: '#2E2C28',
        text: '#2E2C28',
        placeholder: '#A5A3A0',
      };
    default: // light
      return {
        background: '#FFFFFF',
        border: '#F2F2F7',
        text: '#1C1C1E',
        placeholder: '#C7C7CC',
      };
  }
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    flex: 1,
    padding: 8,
    fontSize: 16,
  },
  slot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  error: {
    marginTop: 4,
    fontSize: 12,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export type { InputProps };
