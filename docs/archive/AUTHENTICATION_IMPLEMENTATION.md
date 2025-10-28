# Fomio Authentication Implementation

## Overview

This document describes the implementation of the built-in session login method for Fomio, following the recommended MVP approach for Discourse integration.

## Architecture

### 1. Session Storage (`shared/session-storage.ts`)

Uses Expo SecureStore to securely store Discourse session cookies and user data on the device.

**Features:**

- Encrypted storage using device keychain
- 24-hour session expiration
- Automatic cleanup of expired sessions
- Error handling and fallback

**Key Methods:**

- `storeSession(sessionCookie, userData)` - Securely stores session
- `getSession()` - Retrieves current session
- `clearSession()` - Removes session data
- `isAuthenticated()` - Checks authentication status

### 2. Discourse API (`api/discourse.ts`)

Enhanced to handle session-based authentication with cookies.

**Features:**

- Automatic session cookie extraction from responses
- Cookie-based authentication for subsequent requests
- Fallback to API key authentication if available
- Proper error handling for authentication failures

**Key Methods:**

- `login(credentials)` - Authenticates user and captures session
- `setSessionCookie(cookie)` - Sets session for API requests
- `clearSessionCookie()` - Removes session data
- All API methods automatically include session cookies

### 3. Authentication Hook (`hooks/useAuth.ts`)

React Query-based hook for managing authentication state.

**Features:**

- Automatic session restoration on app startup
- Login/logout mutations with proper error handling
- Session invalidation and cleanup
- Integration with React Query cache

**Key Methods:**

- `login(credentials)` - Authenticates user
- `logout()` - Signs out user and clears data
- `initializeSession()` - Restores session on startup
- `isAuthenticated` - Current authentication status

### 4. Authentication Context (`components/shared/auth-provider.tsx`)

Global authentication state management using React Context.

**Features:**

- Centralized auth state across the app
- Automatic auth status checking
- Loading states for auth operations
- Error handling and user feedback

**Key Methods:**

- `login(credentials)` - Global login function
- `logout()` - Global logout function
- `checkAuthStatus()` - Verify current session
- `isAuthenticated` - Global auth state

### 5. Authentication Guard (`components/shared/auth-guard.tsx`)

Route protection component for authenticated/unauthenticated areas.

**Features:**

- Automatic redirects based on auth status
- Loading states during auth checks
- Configurable authentication requirements
- Seamless user experience

**Usage:**

```tsx
// Protect authenticated routes
<AuthGuard requireAuth={true}>
  <ProtectedComponent />
</AuthGuard>

// Protect auth routes (redirect if already authenticated)
<AuthGuard requireAuth={false}>
  <SignInScreen />
</AuthGuard>
```

### 6. Logout Button (`components/shared/logout-button.tsx`)

Reusable logout component with confirmation dialog.

**Features:**

- Confirmation dialog before logout
- Loading states during logout
- Consistent styling with theme
- Accessibility support

## Implementation Details

### Session Flow

1. **Login Process:**

   ```
   User Input → Discourse API → Session Cookie → Secure Storage → App State
   ```

2. **Session Restoration:**

   ```
   App Startup → Check Secure Storage → Restore Session → Validate with API
   ```

3. **Logout Process:**
   ```
   User Action → Clear Local Session → Clear API Session → Reset App State
   ```

### Security Features

- **HTTPS Enforcement:** All API calls use secure connections
- **Secure Storage:** Session data encrypted using device keychain
- **Session Expiration:** 24-hour automatic timeout
- **Automatic Cleanup:** Invalid sessions are automatically removed
- **Cookie Management:** Proper session cookie handling

### Error Handling

- **Network Errors:** Graceful fallback and user feedback
- **Invalid Sessions:** Automatic cleanup and redirect to login
- **API Failures:** Proper error messages and retry logic
- **Storage Errors:** Fallback to unauthenticated state

## Usage Examples

### Basic Authentication Check

```tsx
import { useAuthContext } from '../components/shared/auth-provider';

function MyComponent() {
  const { isAuthenticated, user, isLoading } = useAuthContext();

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <SignInPrompt />;
  }

  return <WelcomeMessage user={user} />;
}
```

### Protected Routes

```tsx
import { AuthGuard } from '../components/shared/auth-guard';

function AppLayout() {
  return (
    <AuthProvider>
      <AuthGuard requireAuth={true}>
        <MainApp />
      </AuthGuard>
    </AuthProvider>
  );
}
```

### Login Implementation

```tsx
import { useAuthContext } from '../components/shared/auth-provider';

function SignInScreen() {
  const { login, isLoggingIn } = useAuthContext();

  const handleSignIn = async (credentials) => {
    try {
      await login(credentials);
      // User is automatically redirected to main app
    } catch (error) {
      // Handle login errors
    }
  };

  return <SignInForm onSubmit={handleSignIn} />;
}
```

## Configuration

### Environment Variables

```bash
# Required
EXPO_PUBLIC_DISCOURSE_URL=https://your-discourse-instance.com

# Optional (for API key authentication fallback)
EXPO_PUBLIC_DISCOURSE_API_KEY=your_api_key
EXPO_PUBLIC_DISCOURSE_USERNAME=your_username
```

### Discourse Backend Requirements

1. **HTTPS Enabled:** All endpoints must use HTTPS
2. **Session Endpoints:** `/session` endpoint must be accessible
3. **Cookie Support:** Must return proper session cookies
4. **CORS Configuration:** Allow mobile app origins

## Testing

### Manual Testing

1. **Fresh Install:** App should show signin screen
2. **Successful Login:** Should redirect to main app
3. **Session Persistence:** App should remember login after restart
4. **Logout:** Should clear session and return to signin
5. **Session Expiry:** Should handle expired sessions gracefully

### Automated Testing

```bash
# Run authentication tests
npm test -- --testPathPattern=auth

# Run all tests
npm test
```

## Troubleshooting

### Common Issues

1. **Session Not Persisting:**
   - Check SecureStore permissions
   - Verify session storage implementation
   - Check for storage errors in console

2. **Login Fails:**
   - Verify Discourse URL is correct
   - Check network connectivity
   - Verify credentials are valid
   - Check Discourse server logs

3. **App Crashes on Startup:**
   - Check for TypeScript compilation errors
   - Verify all dependencies are installed
   - Check console for runtime errors

### Debug Mode

Enable debug logging by setting:

```typescript
// In session-storage.ts
const DEBUG = true;

// In auth-provider.tsx
const DEBUG = true;
```

## Future Enhancements

1. **Biometric Authentication:** Add Face ID/Touch ID support
2. **Multi-Factor Authentication:** Support for 2FA
3. **Session Refresh:** Automatic token refresh
4. **Offline Support:** Cached authentication state
5. **Analytics:** Authentication event tracking

## Security Considerations

1. **HTTPS Only:** Never use HTTP for authentication
2. **Certificate Pinning:** Consider implementing for production
3. **Session Rotation:** Regular session refresh
4. **Audit Logging:** Track authentication events
5. **Rate Limiting:** Implement on client side

## Support

For issues or questions about the authentication implementation:

1. Check this documentation
2. Review console logs for errors
3. Test with Discourse's built-in authentication
4. Verify network connectivity and HTTPS
5. Check Expo SecureStore compatibility

---

**Note:** This implementation follows security best practices for mobile applications and leverages Discourse's built-in authentication system for maximum compatibility and security.
