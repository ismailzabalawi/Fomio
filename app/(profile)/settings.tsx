import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../components/shared/theme-provider';
import { useDiscourseUser } from '../../shared/useDiscourseUser';
import { Switch } from '../../components/ui/switch';
import { Button } from '../../components/ui/button';
import { 
  GearSix, 
  Bell, 
  Shield, 
  Palette, 
  User, 
  SignOut, 
  CaretRight,
  Moon,
  Sun,
  Globe,
  Lock,
  Eye,
  EyeSlash,
  Trash,
  Key
} from 'phosphor-react-native';

interface SettingsRowProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
}

function SettingsRow({ icon, title, subtitle, onPress, rightElement, showChevron = true }: SettingsRowProps) {
  const { isDark } = useTheme();
  
  const colors = {
    background: isDark ? '#18181b' : '#fff',
    text: isDark ? '#f4f4f5' : '#18181b',
    secondary: isDark ? '#a1a1aa' : '#64748b',
    border: isDark ? '#27272a' : '#e4e4e7',
    accent: isDark ? '#38bdf8' : '#0ea5e9',
  };

  return (
    <TouchableOpacity
      style={[styles.settingsRow, { backgroundColor: colors.background, borderBottomColor: colors.border }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingsRowLeft}>
        <View style={[styles.iconContainer, { backgroundColor: colors.accent + '20' }]}>
          {icon}
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.settingsTitle, { color: colors.text }]}>{title}</Text>
          {subtitle && (
            <Text style={[styles.settingsSubtitle, { color: colors.secondary }]}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.settingsRowRight}>
        {rightElement}
        {showChevron && onPress && (
          <CaretRight size={20} color={colors.secondary} style={styles.chevron} />
        )}
      </View>
    </TouchableOpacity>
  );
}

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingsSection({ title, children }: SettingsSectionProps) {
  const { isDark } = useTheme();
  
  const colors = {
    text: isDark ? '#f4f4f5' : '#18181b',
    secondary: isDark ? '#a1a1aa' : '#64748b',
  };

  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.secondary }]}>{title}</Text>
      {children}
    </View>
  );
}

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const { 
    user, 
    settings, 
    updating, 
    updateSettings, 
    error,
    settingsError 
  } = useDiscourseUser();

  const [localSettings, setLocalSettings] = useState({
    pushNotifications: settings?.push_notifications ?? true,
    emailDigests: settings?.email_digests ?? true,
    hideProfile: settings?.hide_profile_and_presence ?? false,
    allowPrivateMessages: settings?.allow_private_messages ?? true,
    externalLinksNewTab: settings?.external_links_in_new_tab ?? true,
  });

  const colors = {
    background: isDark ? '#09090b' : '#f8fafc',
    cardBackground: isDark ? '#18181b' : '#fff',
    text: isDark ? '#f4f4f5' : '#18181b',
    secondary: isDark ? '#a1a1aa' : '#64748b',
    accent: isDark ? '#38bdf8' : '#0ea5e9',
    destructive: isDark ? '#ef4444' : '#dc2626',
  };

  const handleSettingChange = async (key: keyof typeof localSettings, value: boolean) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
    
    // Map local settings to Discourse settings
    const discourseSettingsMap: Record<string, keyof typeof settings> = {
      pushNotifications: 'push_notifications',
      emailDigests: 'email_digests',
      hideProfile: 'hide_profile_and_presence',
      allowPrivateMessages: 'allow_private_messages',
      externalLinksNewTab: 'external_links_in_new_tab',
    };

    const discourseKey = discourseSettingsMap[key];
    if (discourseKey) {
      const success = await updateSettings({ [discourseKey]: value });
      if (!success) {
        // Revert local state if update failed
        setLocalSettings(prev => ({ ...prev, [key]: !value }));
        Alert.alert('Error', settingsError || 'Failed to update setting');
      }
    }
  };

  const handleEditProfile = () => {
    router.push('/(profile)/edit-profile' as any);
  };

  const handleChangePassword = () => {
    router.push('/(profile)/change-password' as any);
  };

  const handlePrivacySettings = () => {
    router.push('/(profile)/privacy' as any);
  };

  const handleNotificationSettings = () => {
    router.push('/(profile)/notifications' as any);
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Sign Out', 
          style: 'destructive',
          onPress: () => {
            // Handle sign out logic
            router.replace('/(auth)/signin' as any);
          }
        },
      ]
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Delete Account',
      'This action cannot be undone. Are you sure you want to delete your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            router.push('/(profile)/delete-account' as any);
          }
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={[styles.loadingText, { color: colors.text }]}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.cardBackground }]}>
        <GearSix size={32} color={colors.accent} />
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
        <Text style={[styles.headerSubtitle, { color: colors.secondary }]}>
          Manage your account and preferences
        </Text>
      </View>

      {/* Account Section */}
      <SettingsSection title="Account">
        <SettingsRow
          icon={<User size={24} color={colors.accent} />}
          title="Edit Profile"
          subtitle="Update your profile information"
          onPress={handleEditProfile}
        />
        <SettingsRow
          icon={<Key size={24} color={colors.accent} />}
          title="Change Password"
          subtitle="Update your account password"
          onPress={handleChangePassword}
        />
      </SettingsSection>

      {/* Notifications Section */}
      <SettingsSection title="Notifications">
        <SettingsRow
          icon={<Bell size={24} color={colors.accent} />}
          title="Push Notifications"
          subtitle="Receive notifications on your device"
          rightElement={
            <Switch
              checked={localSettings.pushNotifications}
              onCheckedChange={(value: boolean) => handleSettingChange('pushNotifications', value)}
              disabled={updating}
            />
          }
          showChevron={false}
        />
        <SettingsRow
          icon={<Globe size={24} color={colors.accent} />}
          title="Email Digests"
          subtitle="Receive email summaries"
          rightElement={
            <Switch
              checked={localSettings.emailDigests}
              onCheckedChange={(value: boolean) => handleSettingChange('emailDigests', value)}
              disabled={updating}
            />
          }
          showChevron={false}
        />
        <SettingsRow
          icon={<Bell size={24} color={colors.accent} />}
          title="Notification Settings"
          subtitle="Customize notification preferences"
          onPress={handleNotificationSettings}
        />
      </SettingsSection>

      {/* Privacy Section */}
      <SettingsSection title="Privacy & Security">
        <SettingsRow
          icon={<EyeSlash size={24} color={colors.accent} />}
          title="Hide Profile"
          subtitle="Hide your profile from other users"
          rightElement={
            <Switch
              checked={localSettings.hideProfile}
              onCheckedChange={(value: boolean) => handleSettingChange('hideProfile', value)}
              disabled={updating}
            />
          }
          showChevron={false}
        />
        <SettingsRow
          icon={<Lock size={24} color={colors.accent} />}
          title="Private Messages"
          subtitle="Allow others to send you private messages"
          rightElement={
            <Switch
              checked={localSettings.allowPrivateMessages}
              onCheckedChange={(value: boolean) => handleSettingChange('allowPrivateMessages', value)}
              disabled={updating}
            />
          }
          showChevron={false}
        />
        <SettingsRow
          icon={<Shield size={24} color={colors.accent} />}
          title="Privacy Settings"
          subtitle="Manage your privacy preferences"
          onPress={handlePrivacySettings}
        />
      </SettingsSection>

      {/* Appearance Section */}
      <SettingsSection title="Appearance">
        <SettingsRow
          icon={isDark ? <Moon size={24} color={colors.accent} /> : <Sun size={24} color={colors.accent} />}
          title="Dark Mode"
          subtitle={`Currently using ${isDark ? 'dark' : 'light'} theme`}
          rightElement={
            <Switch
              checked={isDark}
              onCheckedChange={toggleTheme}
            />
          }
          showChevron={false}
        />
        <SettingsRow
          icon={<Globe size={24} color={colors.accent} />}
          title="External Links"
          subtitle="Open external links in new tab"
          rightElement={
            <Switch
              checked={localSettings.externalLinksNewTab}
              onCheckedChange={(value: boolean) => handleSettingChange('externalLinksNewTab', value)}
              disabled={updating}
            />
          }
          showChevron={false}
        />
      </SettingsSection>

      {/* Account Actions */}
      <SettingsSection title="Account Actions">
        <SettingsRow
          icon={<SignOut size={24} color={colors.destructive} />}
          title="Sign Out"
          subtitle="Sign out of your account"
          onPress={handleSignOut}
        />
        <SettingsRow
          icon={<Trash size={24} color={colors.destructive} />}
          title="Delete Account"
          subtitle="Permanently delete your account"
          onPress={handleDeleteAccount}
        />
      </SettingsSection>

      {/* Error Display */}
      {(error || settingsError) && (
        <View style={[styles.errorContainer, { backgroundColor: colors.destructive + '20' }]}>
          <Text style={[styles.errorText, { color: colors.destructive }]}>
            {error || settingsError}
          </Text>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.secondary }]}>
          Connected to Discourse Forum
        </Text>
        <Text style={[styles.footerText, { color: colors.secondary }]}>
          Version 1.0.0
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
    marginHorizontal: 24,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingsSubtitle: {
    fontSize: 14,
  },
  chevron: {
    marginLeft: 8,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
  errorContainer: {
    margin: 24,
    padding: 16,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    textAlign: 'center',
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    marginBottom: 4,
  },
});

