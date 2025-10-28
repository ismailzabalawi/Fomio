import React, { useState, useRef } from 'react';
import {
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { X, CheckCircle, WarningCircle } from 'phosphor-react-native';
import { useTheme } from './theme-provider';
import { SessionStorage } from '../../shared/session-storage';
import { discourseApi } from '../../api';

interface WebAuthModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (userData: any) => void;
  onError: (error: string) => void;
}

export function WebAuthModal({
  visible,
  onClose,
  onSuccess,
  onError,
}: WebAuthModalProps) {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [authStatus, setAuthStatus] = useState<
    'idle' | 'authenticating' | 'success' | 'error'
  >('idle');
  const webViewRef = useRef<WebView>(null);

  const colors = {
    background: isDark ? '#18181b' : '#ffffff',
    text: isDark ? '#f9fafb' : '#111827',
    primary: isDark ? '#38bdf8' : '#0ea5e9',
    border: isDark ? '#374151' : '#e5e7eb',
    success: isDark ? '#10b981' : '#059669',
    error: isDark ? '#ef4444' : '#dc2626',
  };

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    console.log('🌐 Navigation changed to:', url);

    // Check if we're on a page that indicates successful login
    // Look for user profile pages, dashboard, or any page that suggests logged-in state
    if (
      url.includes('/u/') &&
      !url.includes('/login') &&
      !url.includes('/signup')
    ) {
      console.log(
        '✅ Detected successful login, attempting to capture session'
      );
      handleSuccessfulLogin();
    }

    // Also check for other indicators of successful login
    if (
      url.includes('/latest') ||
      url.includes('/categories') ||
      url.includes('/top')
    ) {
      console.log(
        '✅ Detected successful login via navigation, attempting to capture session'
      );
      handleSuccessfulLogin();
    }
  };

  const handleMessage = (event: any) => {
    console.log('📨 Received message from WebView:', event.nativeEvent.data);

    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'cookies' && data.cookies) {
        console.log('🍪 Extracted cookies:', data.cookies);

        // Extract session cookie
        const sessionMatch = data.cookies.match(/session=([^;]+)/);
        if (sessionMatch) {
          const sessionCookie = `session=${sessionMatch[1]}`;
          console.log('🔑 Session cookie extracted:', sessionCookie);

          // Set the session cookie in the API
          discourseApi.setSessionCookie(sessionCookie);

          // Try to get current user to verify authentication
          verifyUserSession(sessionCookie);
        } else {
          console.error('❌ No session cookie found in cookies');
          setAuthStatus('error');
          onError('Failed to capture session cookie');
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.error('❌ Error parsing WebView message:', error);
      setAuthStatus('error');
      onError('Failed to parse authentication response');
      setIsLoading(false);
    }
  };

  const verifyUserSession = async (sessionCookie: string) => {
    try {
      console.log('🔍 Verifying user session...');

      const userResponse = await discourseApi.getCurrentUser();
      if (userResponse.user) {
        console.log('✅ User verified:', (userResponse.user as any).username);

        // Store session securely
        await SessionStorage.storeSession(
          sessionCookie,
          sessionCookie,
          '',
          userResponse.user
        );
        setAuthStatus('success');

        // Close modal after a brief success display
        setTimeout(() => {
          onSuccess(userResponse.user);
          onClose();
        }, 1500);
      } else {
        console.error('❌ User verification failed');
        setAuthStatus('error');
        onError('Login verification failed');
      }
    } catch (error) {
      console.error('❌ Failed to verify user after login:', error);
      setAuthStatus('error');
      onError('Login successful but failed to verify user session');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessfulLogin = async () => {
    try {
      setIsLoading(true);
      setAuthStatus('authenticating');

      console.log('🔐 Attempting to capture session after successful login');

      // Inject script to send cookies back
      const scriptToInject = `
        (function() {
          const cookies = document.cookie;
          console.log('🍪 Sending cookies to app:', cookies);
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'cookies',
            cookies: cookies
          }));
        })();
      `;

      webViewRef.current?.injectJavaScript(scriptToInject);

      // Set a timeout in case the message doesn't come through
      setTimeout(() => {
        if (isLoading) {
          console.log('⏰ Timeout reached, trying alternative approach');
          // Try to verify user directly
          verifyUserSession('');
        }
      }, 5000);
    } catch (error) {
      console.error('❌ Error during login process:', error);
      setAuthStatus('error');
      onError('An error occurred during login');
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (authStatus === 'authenticating') {
      Alert.alert(
        'Login in Progress',
        'Are you sure you want to cancel the login process?',
        [
          { text: 'Continue Login', style: 'cancel' },
          { text: 'Cancel', style: 'destructive', onPress: onClose },
        ]
      );
    } else {
      onClose();
    }
  };

  const renderStatusContent = () => {
    switch (authStatus) {
      case 'authenticating':
        return (
          <View style={styles.statusContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.statusText, { color: colors.text }]}>
              Verifying login...
            </Text>
          </View>
        );
      case 'success':
        return (
          <View style={styles.statusContainer}>
            <CheckCircle size={48} color={colors.success} weight="fill" />
            <Text style={[styles.statusText, { color: colors.text }]}>
              Login successful!
            </Text>
            <Text style={[styles.statusSubtext, { color: colors.text }]}>
              Redirecting to app...
            </Text>
          </View>
        );
      case 'error':
        return (
          <View style={styles.statusContainer}>
            <WarningCircle size={48} color={colors.error} weight="fill" />
            <Text style={[styles.statusText, { color: colors.text }]}>
              Login failed
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={() => setAuthStatus('idle')}
            >
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>
            Sign In to TechRebels
          </Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.text} weight="bold" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {authStatus === 'idle' ? (
            <WebView
              ref={webViewRef}
              source={{ uri: 'https://bff.example.com/auth/start' }}
              style={styles.webview}
              onNavigationStateChange={handleNavigationStateChange}
              onMessage={handleMessage}
              startInLoadingState={true}
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={[styles.loadingText, { color: colors.text }]}>
                    Loading login page...
                  </Text>
                </View>
              )}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsBackForwardNavigationGestures={false}
            />
          ) : (
            renderStatusContent()
          )}
        </View>
      </View>
    </Modal>
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
  closeButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '500',
  },
  statusContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
  },
  statusSubtext: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
