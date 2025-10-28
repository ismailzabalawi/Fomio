import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Download, Trash, Funnel } from 'phosphor-react-native';
import { useTheme } from './theme-provider';
import { errorLogger, LogEntry } from '../../shared/error-logger';

interface LogViewerProps {
  visible: boolean;
  onClose: () => void;
}

export function LogViewer({ visible, onClose }: LogViewerProps) {
  const { isDark } = useTheme();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [filter, setFilter] = useState<
    'ALL' | 'ERROR' | 'WARN' | 'API' | 'CSRF'
  >('ALL');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const colors = {
    background: isDark ? '#18181b' : '#ffffff',
    card: isDark ? '#27272a' : '#f8fafc',
    text: isDark ? '#f9fafb' : '#111827',
    secondary: isDark ? '#a1a1aa' : '#64748b',
    border: isDark ? '#374151' : '#e2e8f0',
    error: '#ef4444',
    warn: '#f59e0b',
    info: '#3b82f6',
    api: '#8b5cf6',
    csrf: '#10b981',
  };

  useEffect(() => {
    if (visible) {
      refreshLogs();
      const interval = setInterval(() => {
        if (autoRefresh) {
          refreshLogs();
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [visible, autoRefresh]);

  const refreshLogs = () => {
    const allLogs = errorLogger.getLogs();
    setLogs(allLogs);
  };

  const getFilteredLogs = () => {
    if (filter === 'ALL') return logs;
    return logs.filter((log) => log.level === filter);
  };

  const getLevelColor = (level: LogEntry['level']) => {
    switch (level) {
      case 'ERROR':
        return colors.error;
      case 'WARN':
        return colors.warn;
      case 'INFO':
        return colors.info;
      case 'API':
        return colors.api;
      case 'DEBUG':
        return colors.secondary;
      default:
        return colors.text;
    }
  };

  const getCategoryColor = (category: LogEntry['category']) => {
    switch (category) {
      case 'CSRF':
        return colors.csrf;
      case 'API':
        return colors.api;
      case 'AUTH':
        return colors.info;
      case 'UI':
        return colors.info;
      case 'NAVIGATION':
        return colors.info;
      case 'STORAGE':
        return colors.info;
      case 'GENERAL':
        return colors.secondary;
      default:
        return colors.secondary;
    }
  };

  const exportLogs = async () => {
    try {
      const exportPath = await errorLogger.exportLogs();
      Alert.alert('Success', `Logs exported to: ${exportPath}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to export logs');
    }
  };

  const clearLogs = () => {
    Alert.alert('Clear Logs', 'Are you sure you want to clear all logs?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear',
        style: 'destructive',
        onPress: () => {
          errorLogger.clearLogs();
          refreshLogs();
        },
      },
    ]);
  };

  const shareLogs = async () => {
    try {
      const recentLogs = errorLogger.getRecentLogs(100);
      const logText = recentLogs
        .map(
          (log) =>
            `[${log.timestamp}] [${log.level}] [${log.category}] ${log.message}`
        )
        .join('\n');

      await Share.share({
        message: `Fomio App Logs:\n\n${logText}`,
        title: 'Fomio App Logs',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share logs');
    }
  };

  const getLogStats = () => {
    const stats = errorLogger.getLogStats();
    return stats;
  };

  if (!visible) return null;

  const filteredLogs = getFilteredLogs();
  const stats = getLogStats();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>App Logs</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={() => setAutoRefresh(!autoRefresh)}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              {autoRefresh ? 'Auto' : 'Manual'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={refreshLogs}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              Refresh
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={exportLogs}
          >
            <Download size={20} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.card }]}
            onPress={shareLogs}
          >
            <Text style={[styles.actionButtonText, { color: colors.text }]}>
              Share
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: colors.error }]}
            onPress={clearLogs}
          >
            <Trash size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color={colors.text} weight="bold" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View
        style={[
          styles.statsContainer,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Text style={[styles.statsTitle, { color: colors.text }]}>
          Log Statistics
        </Text>
        <View style={styles.statsRow}>
          <Text style={[styles.statsText, { color: colors.secondary }]}>
            Total: {stats.total}
          </Text>
          <Text style={[styles.statsText, { color: colors.error }]}>
            Errors: {stats.byLevel.ERROR || 0}
          </Text>
          <Text style={[styles.statsText, { color: colors.warn }]}>
            Warnings: {stats.byLevel.WARN || 0}
          </Text>
          <Text style={[styles.statsText, { color: colors.api }]}>
            API: {stats.byLevel.API || 0}
          </Text>
        </View>
      </View>

      {/* Filter Tabs */}
      <View
        style={[styles.filterContainer, { borderBottomColor: colors.border }]}
      >
        {(['ALL', 'ERROR', 'WARN', 'API', 'CSRF'] as const).map(
          (filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[
                styles.filterTab,
                filter === filterType && { backgroundColor: colors.info },
              ]}
              onPress={() => setFilter(filterType)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  { color: filter === filterType ? '#ffffff' : colors.text },
                ]}
              >
                {filterType}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      {/* Logs */}
      <ScrollView
        style={styles.logsContainer}
        showsVerticalScrollIndicator={false}
      >
        {filteredLogs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyStateText, { color: colors.secondary }]}>
              No logs found for {filter} filter
            </Text>
          </View>
        ) : (
          filteredLogs.map((log, index) => (
            <View
              key={`${log.timestamp}-${index}`}
              style={[
                styles.logEntry,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={styles.logHeader}>
                <View
                  style={[
                    styles.logLevel,
                    { backgroundColor: getLevelColor(log.level) },
                  ]}
                >
                  <Text style={styles.logLevelText}>{log.level}</Text>
                </View>
                <View
                  style={[
                    styles.logCategory,
                    { backgroundColor: getCategoryColor(log.category) },
                  ]}
                >
                  <Text style={styles.logCategoryText}>{log.category}</Text>
                </View>
                <Text
                  style={[styles.logTimestamp, { color: colors.secondary }]}
                >
                  {new Date(log.timestamp).toLocaleTimeString()}
                </Text>
              </View>

              <Text style={[styles.logMessage, { color: colors.text }]}>
                {log.message}
              </Text>

              {log.details && (
                <Text style={[styles.logDetails, { color: colors.secondary }]}>
                  {JSON.stringify(log.details, null, 2)}
                </Text>
              )}

              {log.stack && (
                <Text style={[styles.logStack, { color: colors.error }]}>
                  {log.stack}
                </Text>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 40,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '500',
  },
  closeButton: {
    padding: 8,
  },
  statsContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  statsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statsText: {
    fontSize: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '500',
  },
  logsContainer: {
    flex: 1,
    padding: 16,
  },
  logEntry: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  logHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  logLevel: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logLevelText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  logCategory: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  logCategoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#ffffff',
  },
  logTimestamp: {
    fontSize: 10,
    marginLeft: 'auto',
  },
  logMessage: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  logDetails: {
    fontSize: 12,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  logStack: {
    fontSize: 11,
    fontFamily: 'monospace',
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyStateText: {
    fontSize: 16,
    fontStyle: 'italic',
  },
});
