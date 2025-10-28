import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthContext } from '../components/shared/auth-provider';
import { bffFetch } from '../lib/apiClient';
import { LoginRequest, SignupRequest, User } from '../api';

export function useAuth() {
  const authContext = useAuthContext();
  const queryClient = useQueryClient();

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      return await authContext.login(credentials);
    },
    onSuccess: () => {
      // Invalidate and refetch user-related queries
      queryClient.invalidateQueries({ queryKey: ['user'] });
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['topics'] });
    },
  });

  // Signup mutation
  const signupMutation = useMutation({
    mutationFn: async (userData: SignupRequest) => {
      return await authContext.signup(userData);
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await authContext.logout();
    },
    onSuccess: () => {
      // Clear all queries on logout
      queryClient.clear();
    },
  });

  // Current user query
  const currentUserQuery = useQuery({
    queryKey: ['user', 'current'],
    queryFn: async (): Promise<User | null> => {
      if (!authContext.isAuthenticated) {
        return null;
      }

      try {
        const response = await bffFetch('/me') as any;
        return response.user;
      } catch (error) {
        // If we can't get the current user, the session might be invalid
        console.error('Failed to get current user:', error);
        return null;
      }
    },
    enabled: authContext.isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    // Auth state
    user: authContext.user,
    isAuthenticated: authContext.isAuthenticated,
    isLoading: authContext.isLoading,
    isLoggingOut: authContext.isLoggingOut,

    // Mutations
    login: loginMutation.mutateAsync,
    loginIsLoading: loginMutation.isPending,
    loginError: loginMutation.error,

    signup: signupMutation.mutateAsync,
    signupIsLoading: signupMutation.isPending,
    signupError: signupMutation.error,

    logout: logoutMutation.mutateAsync,
    logoutIsLoading: logoutMutation.isPending,
    logoutError: logoutMutation.error,

    // Queries
    currentUser: currentUserQuery.data,
    currentUserIsLoading: currentUserQuery.isPending,
    currentUserError: currentUserQuery.error,

    // Manual actions
    checkAuthStatus: authContext.checkAuthStatus,
  };
}
