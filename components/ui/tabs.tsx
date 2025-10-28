import React, { createContext, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface TabsContextType {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export interface TabsProps {
  children: React.ReactNode;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  style?: ViewStyle;
}

export interface TabsListProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export interface TabsTriggerProps {
  children: React.ReactNode;
  value: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export interface TabsContentProps {
  children: React.ReactNode;
  value: string;
  style?: ViewStyle;
}

export function Tabs({
  children,
  defaultValue,
  value,
  onValueChange,
  style,
}: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(value || defaultValue || '');

  const handleTabChange = (newValue: string) => {
    setActiveTab(newValue);
    onValueChange?.(newValue);
  };

  React.useEffect(() => {
    if (value !== undefined) {
      setActiveTab(value);
    }
  }, [value]);

  return (
    <TabsContext.Provider value={{ activeTab, onTabChange: handleTabChange }}>
      <View style={[styles.container, style]}>{children}</View>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, style }: TabsListProps) {
  return <View style={[styles.tabsList, style]}>{children}</View>;
}

export function TabsTrigger({
  children,
  value,
  style,
  textStyle,
}: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsTrigger must be used within a Tabs component');
  }

  const { activeTab, onTabChange } = context;
  const isActive = activeTab === value;

  return (
    <TouchableOpacity
      style={[styles.tabsTrigger, isActive && styles.tabsTriggerActive, style]}
      onPress={() => onTabChange(value)}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.tabsTriggerText,
          isActive && styles.tabsTriggerTextActive,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

export function TabsContent({ children, value, style }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('TabsContent must be used within a Tabs component');
  }

  const { activeTab } = context;

  if (activeTab !== value) {
    return null;
  }

  return <View style={[styles.tabsContent, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  tabsList: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 4,
  },
  tabsTrigger: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsTriggerActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  tabsTriggerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
  },
  tabsTriggerTextActive: {
    color: '#374151',
    fontWeight: '600',
  },
  tabsContent: {
    marginTop: 16,
  },
});
