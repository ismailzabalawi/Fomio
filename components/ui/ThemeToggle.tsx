import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme, ThemeMode } from '../../lib/theme/theme';
import { Sun, Moon, Book } from 'phosphor-react-native';

export default function ThemeToggle() {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  // Get colors based on theme
  const getColors = () => {
    switch (theme) {
      case 'light':
        return {
          background: '#F2F2F7',
          activeBackground: '#FFFFFF',
          text: '#1C1C1E',
          activeText: '#007AFF',
          border: '#E5E5EA',
        };
      case 'dark':
        return {
          background: '#1C1C1E',
          activeBackground: '#2C2C2E',
          text: '#8E8E93',
          activeText: '#0A84FF',
          border: '#3A3A3C',
        };
      case 'reader':
        return {
          background: '#E5DBC0',
          activeBackground: '#F5ECD7',
          text: '#6C6A67',
          activeText: '#2E2C28',
          border: '#D8CCAF',
        };
      default:
        return {
          background: '#1C1C1E',
          activeBackground: '#2C2C2E',
          text: '#8E8E93',
          activeText: '#0A84FF',
          border: '#3A3A3C',
        };
    }
  };
  
  const colors = getColors();
  
  const isActive = (mode: ThemeMode) => theme === mode;
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <TouchableOpacity
        style={[
          styles.option,
          isActive('light') && [styles.activeOption, { backgroundColor: colors.activeBackground }]
        ]}
        onPress={() => setTheme('light')}
      >
        <Sun 
          size={20} 
          color={isActive('light') ? colors.activeText : colors.text} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option,
          isActive('dark') && [styles.activeOption, { backgroundColor: colors.activeBackground }]
        ]}
        onPress={() => setTheme('dark')}
      >
        <Moon 
          size={20} 
          color={isActive('dark') ? colors.activeText : colors.text} 
        />
      </TouchableOpacity>
      
      <TouchableOpacity
        style={[
          styles.option,
          isActive('reader') && [styles.activeOption, { backgroundColor: colors.activeBackground }]
        ]}
        onPress={() => setTheme('reader')}
      >
        <Book 
          size={20} 
          color={isActive('reader') ? colors.activeText : colors.text} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 20,
    borderWidth: 1,
    padding: 4,
    width: 140,
  },
  option: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 16,
  },
  activeOption: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
});
