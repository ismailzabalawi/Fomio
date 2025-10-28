import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { useTheme } from './theme-provider';
import { Eye, EyeSlash, ArrowLeft, CheckCircle } from 'phosphor-react-native';

interface WebViewAuthProps {
  onAuthSuccess: (cookies: {
    authToken: string;
    sessionCookie: string;
    csrfToken: string;
  }) => void;
  onCancel: () => void;
  mode: 'login' | 'signup';
}

interface ExtractedCookies {
  authToken?: string;
  sessionCookie?: string;
  csrfToken?: string;
}

export function WebViewAuth({
  onAuthSuccess,
  onCancel,
  mode,
}: WebViewAuthProps) {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [currentUrl, setCurrentUrl] = useState('');
  const [extractedCookies, setExtractedCookies] = useState<ExtractedCookies>(
    {}
  );
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const webViewRef = useRef<WebView>(null);

  const colors = {
    background: isDark ? '#1a1a1a' : '#ffffff',
    surface: isDark ? '#2a2a2a' : '#f5f5f5',
    primary: isDark ? '#4f46e5' : '#6366f1',
    text: isDark ? '#ffffff' : '#000000',
    textSecondary: isDark ? '#a0a0a0' : '#666666',
    border: isDark ? '#404040' : '#e0e0e0',
    success: isDark ? '#10b981' : '#059669',
    error: isDark ? '#ef4444' : '#dc2626',
  };

  // Backend upgrading - WebView auth temporarily disabled
  const discourseUrl = 'https://bff.example.com';
  const loginUrl = `${discourseUrl}/auth/start`;
  const signupUrl = `${discourseUrl}/auth/start`;

  // Extract cookies from WebView
  const extractCookies = async (): Promise<ExtractedCookies> => {
    try {
      if (!webViewRef.current) return {};

      // Inject JavaScript to extract cookies and send result via postMessage
      const cookieScript = `
        (function() {
          const cookies = document.cookie.split(';').reduce((acc, cookie) => {
            const [name, value] = cookie.trim().split('=');
            acc[name] = value;
            return acc;
          }, {});
          
          const result = {
            authToken: cookies._t || null,
            sessionCookie: cookies._forum_session || null,
            csrfToken: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null
          };
          
          window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'COOKIES_EXTRACTED',
            cookies: result
          }));
        })();
        true;
      `;

      await webViewRef.current.injectJavaScript(cookieScript);
      return {};
    } catch (error) {
      console.error('Failed to extract cookies:', error);
      return {};
    }
  };

  // Check if user is authenticated
  const checkAuthentication = async () => {
    try {
      const cookies = await extractCookies();
      console.log('🍪 Extracted cookies:', cookies);

      if (cookies.authToken && cookies.sessionCookie) {
        setExtractedCookies(cookies);
        setIsAuthenticated(true);

        // Wait a moment for the user to see the success state
        setTimeout(() => {
          onAuthSuccess({
            authToken: cookies.authToken!,
            sessionCookie: cookies.sessionCookie!,
            csrfToken: cookies.csrfToken || '',
          });
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to check authentication:', error);
    }
  };

  // Handle WebView navigation
  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    setCurrentUrl(navState.url);

    // Check if we're on a success page or if cookies are available
    if (
      navState.url.includes('/latest') ||
      navState.url.includes('/categories') ||
      navState.url.includes('/u/')
    ) {
      // User seems to be logged in, check for cookies
      setTimeout(checkAuthentication, 1000);
    }

    // Prevent navigation away from auth pages - redirect back to login/signup
    if (
      !navState.url.includes('/login') &&
      !navState.url.includes('/signup') &&
      !navState.url.includes('/latest') &&
      !navState.url.includes('/categories') &&
      !navState.url.includes('/u/') &&
      !navState.url.includes('/session/')
    ) {
      // User is trying to navigate away from auth flow, redirect them back
      if (webViewRef.current) {
        const redirectUrl = mode === 'login' ? loginUrl : signupUrl;
        webViewRef.current.injectJavaScript(`
          window.location.href = '${redirectUrl}';
          true;
        `);
      }
    }
  };

  // Handle WebView load end
  const handleLoadEnd = () => {
    setIsLoading(false);

    // Check for cookies after page loads
    setTimeout(checkAuthentication, 500);
  };

  // Handle WebView errors
  const handleError = (error: any) => {
    console.error('WebView error:', error);
    setIsLoading(false);
    Alert.alert(
      'Error',
      'Failed to load the authentication page. Please try again.'
    );
  };

  // Handle WebView HTTP errors
  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.error('WebView HTTP error:', nativeEvent);

    if (nativeEvent.statusCode >= 400) {
      let errorMessage = `Failed to connect to ${discourseUrl}. Please check your internet connection and try again.`;

      if (nativeEvent.statusCode === 429) {
        errorMessage =
          'Too many requests. Please wait a moment and try again. The server is temporarily limiting requests.';
      } else if (nativeEvent.statusCode === 503) {
        errorMessage =
          'Service temporarily unavailable. Please try again in a few minutes.';
      } else if (nativeEvent.statusCode >= 500) {
        errorMessage = 'Server error. Please try again later.';
      }

      Alert.alert('Connection Error', errorMessage, [
        {
          text: 'Retry',
          onPress: () => {
            // Reload the WebView
            if (webViewRef.current) {
              webViewRef.current.reload();
            }
          },
        },
        {
          text: 'Cancel',
          onPress: onCancel,
          style: 'cancel',
        },
      ]);
    }
  };

  // Inject JavaScript to monitor authentication
  const injectedJavaScript = `
    (function() {
      // Function to extract and send cookies
      function extractAndSendCookies() {
        const cookies = document.cookie.split(';').reduce((acc, cookie) => {
          const [name, value] = cookie.trim().split('=');
          acc[name] = value;
          return acc;
        }, {});
        
        const result = {
          authToken: cookies._t || null,
          sessionCookie: cookies._forum_session || null,
          csrfToken: document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || null
        };
        
        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'COOKIES_EXTRACTED',
          cookies: result
        }));
      }
      
      // Function to check if user is authenticated
      function isUserAuthenticated() {
        return document.querySelector('.current-user') || 
               document.querySelector('.user-menu') || 
               document.querySelector('[data-user-menu]') ||
               document.querySelector('.header-user-menu') ||
               window.location.pathname.includes('/u/') ||
               window.location.pathname === '/latest' ||
               window.location.pathname === '/categories';
      }
      
      // Extract cookies immediately when page loads
      extractAndSendCookies();
      
      // Monitor for successful login/signup
      const originalPushState = history.pushState;
      history.pushState = function() {
        originalPushState.apply(history, arguments);
        
        // Check if user is authenticated after navigation
        if (isUserAuthenticated()) {
          setTimeout(function() {
            extractAndSendCookies();
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'AUTH_SUCCESS',
              url: window.location.href
            }));
          }, 500);
        }
      };
      
      // Monitor for form submissions
      document.addEventListener('submit', function(e) {
        if (e.target.tagName === 'FORM') {
          setTimeout(function() {
            if (isUserAuthenticated()) {
              extractAndSendCookies();
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'FORM_SUCCESS'
              }));
            }
          }, 1000);
        }
      });
      
      // Monitor for authentication success indicators
      const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'childList') {
            if (isUserAuthenticated()) {
              setTimeout(function() {
                extractAndSendCookies();
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'AUTH_SUCCESS'
                }));
              }, 500);
            }
          }
        });
      });
      
      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Periodically check for cookies (fallback)
      setInterval(function() {
        if (isUserAuthenticated()) {
          extractAndSendCookies();
        }
      }, 2000);
      
      // Prevent navigation away from auth flow
      const originalLocation = window.location;
      Object.defineProperty(window, 'location', {
        get: function() {
          return originalLocation;
        },
        set: function(url) {
          if (typeof url === 'string') {
            if (url.includes('/login') || url.includes('/signup') || 
                url.includes('/latest') || url.includes('/categories') || 
                url.includes('/u/') || url.includes('/session/')) {
              originalLocation.href = url;
            } else {
              // Redirect back to auth page
              const authUrl = '${mode === 'login' ? loginUrl : signupUrl}';
              originalLocation.href = authUrl;
            }
          }
        }
      });
      
      true; // Required for injected JavaScript
    })();
  `;

  // Handle messages from WebView
  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      console.log('📱 WebView message:', data);

      if (data.type === 'COOKIES_EXTRACTED') {
        console.log('🍪 Cookies extracted from WebView:', data.cookies);
        setExtractedCookies(data.cookies);

        if (data.cookies.authToken && data.cookies.sessionCookie) {
          setIsAuthenticated(true);

          // Automatically close after a short success display
          setTimeout(() => {
            onAuthSuccess({
              authToken: data.cookies.authToken,
              sessionCookie: data.cookies.sessionCookie,
              csrfToken: data.cookies.csrfToken || '',
            });
          }, 800);
        }
      } else if (data.type === 'AUTH_SUCCESS' || data.type === 'FORM_SUCCESS') {
        checkAuthentication();
      }
    } catch (error) {
      console.error('Failed to parse WebView message:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <TouchableOpacity onPress={onCancel} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} weight="bold" />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {mode === 'login'
            ? 'Sign In to TechRebels'
            : 'Create TechRebels Account'}
        </Text>

        {isAuthenticated && (
          <View style={styles.successIndicator}>
            <CheckCircle size={24} color={colors.success} weight="fill" />
          </View>
        )}
      </View>

      {/* Backend Upgrade Message */}
      <View
        style={[
          styles.upgradeMessage,
          { backgroundColor: colors.surface, borderBottomColor: colors.border },
        ]}
      >
        <Text style={[styles.upgradeText, { color: colors.textSecondary }]}>
          Backend upgrading - Authentication temporarily disabled
        </Text>
      </View>

      {/* WebView Container */}
      <View style={styles.webViewContainer}>
        {isLoading && (
          <View
            style={[
              styles.loadingOverlay,
              { backgroundColor: colors.background },
            ]}
          >
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Loading {mode === 'login' ? 'Sign In' : 'Sign Up'} Page...
            </Text>
          </View>
        )}

        <WebView
          ref={webViewRef}
          source={{ uri: mode === 'login' ? loginUrl : signupUrl }}
          style={styles.webView}
          onNavigationStateChange={handleNavigationStateChange}
          onLoadEnd={handleLoadEnd}
          onError={handleError}
          onHttpError={handleHttpError}
          injectedJavaScript={injectedJavaScript}
          onMessage={handleMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          allowsBackForwardNavigationGestures={true}
          userAgent="FomioMobile/1.0"
        />
      </View>

      {/* Status Bar */}
      <View
        style={[
          styles.statusBar,
          { backgroundColor: colors.surface, borderTopColor: colors.border },
        ]}
      >
        <Text style={[styles.statusText, { color: colors.textSecondary }]}>
          {isAuthenticated
            ? '✅ Authentication successful! Returning to app...'
            : `🔐 ${mode === 'login' ? 'Sign in' : 'Sign up'} to continue to the app`}
        </Text>

        {isAuthenticated && (
          <View style={styles.cookieStatus}>
            <Text style={[styles.cookieText, { color: colors.success }]}>
              🍪 Cookies extracted successfully
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  successIndicator: {
    marginLeft: 12,
  },
  webViewContainer: {
    flex: 1,
    position: 'relative',
  },
  webView: {
    flex: 1,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  statusBar: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  statusText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  cookieStatus: {
    alignItems: 'center',
  },
  cookieText: {
    fontSize: 12,
    fontWeight: '500',
  },
  upgradeMessage: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  upgradeText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});
