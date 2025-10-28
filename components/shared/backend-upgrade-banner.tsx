import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Warning } from 'phosphor-react-native';

export function BackendUpgradeBanner() {
  return (
    <View style={styles.banner}>
      <Warning size={20} color="#f59e0b" weight="fill" />
      <Text style={styles.text}>
        Backend upgrading—please log in again after update.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f59e0b',
  },
  text: {
    marginLeft: 8,
    color: '#92400e',
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
});
