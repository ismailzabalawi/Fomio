import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X, Warning, Clock, WifiSlash } from 'phosphor-react-native';

export interface ErrorBannerProps {
  error?: {
    code?: string;
    message?: string;
  } | null;
  onDismiss?: () => void;
}

export function ErrorBanner({ error, onDismiss }: ErrorBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (error) {
      setIsVisible(true);
    }
  }, [error]);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible || !error) {
    return null;
  }

  const getErrorConfig = () => {
    switch (error.code) {
      case 'RATE_LIMITED':
        return {
          icon: Clock,
          color: '#f59e0b',
          backgroundColor: '#fef3c7',
          borderColor: '#f59e0b',
          textColor: '#92400e',
        };
      case 'UPSTREAM_ERROR':
        return {
          icon: WifiSlash,
          color: '#ef4444',
          backgroundColor: '#fef2f2',
          borderColor: '#ef4444',
          textColor: '#dc2626',
        };
      case 'UNAUTHORIZED':
        return {
          icon: Warning,
          color: '#6366f1',
          backgroundColor: '#eef2ff',
          borderColor: '#6366f1',
          textColor: '#4338ca',
        };
      default:
        return {
          icon: Warning,
          color: '#6b7280',
          backgroundColor: '#f9fafb',
          borderColor: '#6b7280',
          textColor: '#374151',
        };
    }
  };

  const config = getErrorConfig();
  const IconComponent = config.icon;

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: config.backgroundColor,
          borderBottomColor: config.borderColor,
        },
      ]}
    >
      <IconComponent size={20} color={config.color} weight="fill" />
      <Text style={[styles.text, { color: config.textColor }]}>
        {error.message || 'An error occurred'}
      </Text>
      {onDismiss && (
        <TouchableOpacity onPress={handleDismiss} style={styles.dismissButton}>
          <X size={16} color={config.textColor} weight="bold" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  text: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  dismissButton: {
    marginLeft: 8,
    padding: 4,
  },
});
