import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService, AuthState, User } from '../../lib/auth';

interface AuthContextType extends AuthState {
  startLogin: () => Promise<void>;
  logout: () => Promise<void>;
  checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function BffAuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(authService.getState());

  useEffect(() => {
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);

  const startLogin = async () => {
    await authService.startLogin();
  };

  const logout = async () => {
    await authService.logout();
  };

  const checkAuthStatus = async () => {
    await authService.hydrateFromStorage();
  };

  const value: AuthContextType = {
    ...authState,
    startLogin,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useBffAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useBffAuth must be used within a BffAuthProvider');
  }
  return context;
}

// Export for backward compatibility
export const useAuthContext = useBffAuth;
