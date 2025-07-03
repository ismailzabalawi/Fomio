import React, { createContext, useContext } from 'react';
import { Pressable, Text, StyleSheet, View } from 'react-native';
import { useTheme } from '../../lib/theme/theme';
import type { IconProps as PhosphorIconProps } from 'phosphor-react-native';
import { cn } from '../../lib/utils/cn';

interface ButtonContextValue {
  variant: 'solid' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled: boolean;
  getTextColor: () => string;
  getFontSize: () => number;
}

const ButtonContext = createContext<ButtonContextValue | undefined>(undefined);

interface ButtonRootProps {
  onPress: () => void;
  variant?: 'solid' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  accessibilityLabel?: string;
  className?: string;
  children?: React.ReactNode;
}

interface ButtonIconProps {
  Icon: React.ComponentType<PhosphorIconProps>;
  props?: Partial<PhosphorIconProps>;
  position?: 'left' | 'right';
}

interface ButtonTextProps {
  children: React.ReactNode;
  className?: string;
}

// Button Root Component
export const Button = React.forwardRef<View, ButtonRootProps>((props, ref) => {
  const {
    onPress,
    variant = 'solid',
    size = 'md',
    disabled = false,
    accessibilityLabel,
    className,
    children,
    ...rest
  } = props;
  
  const { theme } = useTheme();
  
  // Get background color based on theme and variant
  const getBackgroundColor = () => {
    if (disabled) return '#CCCCCC';
    
    if (variant === 'outline' || variant === 'ghost') {
      return 'transparent';
    }
    
    switch (theme) {
      case 'light':
        return '#007AFF';
      case 'dark':
        return '#0A84FF';
      case 'reader':
        return '#2E2C28';
      default:
        return '#007AFF';
    }
  };
  
  // Get text color based on theme and variant
  const getTextColor = () => {
    if (disabled) return '#888888';
    
    if (variant === 'outline' || variant === 'ghost') {
      switch (theme) {
        case 'light':
          return '#007AFF';
        case 'dark':
          return '#0A84FF';
        case 'reader':
          return '#2E2C28';
        default:
          return '#007AFF';
      }
    }
    
    return theme === 'dark' ? '#FFFFFF' : '#FFFFFF';
  };
  
  // Get border color based on theme and variant
  const getBorderColor = () => {
    if (disabled) return '#CCCCCC';
    
    if (variant === 'outline') {
      switch (theme) {
        case 'light':
          return '#007AFF';
        case 'dark':
          return '#0A84FF';
        case 'reader':
          return '#2E2C28';
        default:
          return '#007AFF';
      }
    }
    
    return 'transparent';
  };
  
  // Get padding based on size
  const getPadding = () => {
    switch (size) {
      case 'sm':
        return { paddingVertical: 6, paddingHorizontal: 12 };
      case 'lg':
        return { paddingVertical: 12, paddingHorizontal: 24 };
      default:
        return { paddingVertical: 8, paddingHorizontal: 16 };
    }
  };

  // Get font size based on size
  const getFontSize = () => {
    switch (size) {
      case 'sm':
        return 14;
      case 'lg':
        return 18;
      default:
        return 16;
    }
  };

  const contextValue: ButtonContextValue = {
    variant,
    size,
    disabled,
    getTextColor,
    getFontSize,
  };
  
  return (
    <ButtonContext.Provider value={contextValue}>
      <Pressable
        ref={ref as React.RefObject<View>}
        onPress={onPress}
        disabled={disabled}
        style={[
          styles.button,
          {
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            borderWidth: variant === 'outline' ? 1 : 0,
            ...getPadding(),
          },
        ]}
        className={cn(
          'flex-row items-center justify-center rounded-lg',
          disabled && 'opacity-50',
          className
        )}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled }}
        {...rest}
      >
        {children}
      </Pressable>
    </ButtonContext.Provider>
  );
});

// Button Text Component
export const ButtonText = React.forwardRef<Text, ButtonTextProps>((props, ref) => {
  const { children, className, ...rest } = props;
  const context = useContext(ButtonContext);
  const { theme } = useTheme();

  if (!context) {
    throw new Error('ButtonText must be used within a Button component');
  }

  const { getTextColor, getFontSize } = context;

  return (
    <Text
      ref={ref}
      style={[
        styles.text,
        {
          color: getTextColor(),
          fontSize: getFontSize(),
          fontFamily: theme === 'reader' ? 'Georgia' : 'System',
        },
      ]}
      className={cn('font-semibold', className)}
      {...rest}
    >
      {children}
    </Text>
  );
});

// Button Icon Component
export const ButtonIcon = React.forwardRef<View, ButtonIconProps>((props, ref) => {
  const { Icon, position = 'left', props: iconProps } = props;
  const context = useContext(ButtonContext);

  if (!context) {
    throw new Error('ButtonIcon must be used within a Button component');
  }

  const { getTextColor, getFontSize } = context;
  
  return (
    <View
      ref={ref}
      style={[
        styles.icon,
        position === 'left' ? styles.iconLeft : styles.iconRight
      ]}
    >
      <Icon 
        size={getFontSize()} 
        color={getTextColor()}
        {...iconProps}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontWeight: '600',
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

Button.displayName = 'Button';
ButtonText.displayName = 'ButtonText';
ButtonIcon.displayName = 'ButtonIcon';

export type { ButtonRootProps, ButtonTextProps, ButtonIconProps };
