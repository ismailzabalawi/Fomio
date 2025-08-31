import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { discourseApi } from '../api';
import { LoginRequest, User } from '../api/discourse';

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const queryClient = useQueryClient();

  // Get current user session
  const { data: currentUser, isLoading: isLoadingUser } = useQuery({
    queryKey: ['auth', 'currentUser'],
    queryFn: () => discourseApi.getCurrentUser(),
    retry: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginRequest) => discourseApi.login(credentials),
    onSuccess: (data) => {
      // Invalidate and refetch current user
      queryClient.invalidateQueries({ queryKey: ['auth', 'currentUser'] });
      // Invalidate user-specific data
      if (data.user?.username) {
        queryClient.invalidateQueries({ queryKey: ['user', data.user.username] });
      }
    },
    onError: (error) => {
      console.error('Login failed:', error);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: () => discourseApi.logout(),
    onSuccess: () => {
      // Clear all user-related data
      queryClient.clear();
      // Reset auth state
      queryClient.setQueryData(['auth', 'currentUser'], null);
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });

  return {
    // State
    user: currentUser?.user || null,
    isAuthenticated: !!currentUser?.user,
    isLoading: isLoadingUser,

    // Actions
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    logoutError: logoutMutation.error,
  };
}
