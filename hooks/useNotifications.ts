import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { discourseApi } from '../api';

export function useNotifications() {
  const queryClient = useQueryClient();

  // Get notifications
  const { data: notificationsData, isLoading, error } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => discourseApi.getNotifications(),
    staleTime: 1000 * 60 * 1, // 1 minute (notifications change frequently)
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 2, // Refetch every 2 minutes
  });

  // Mark notification as read
  const markReadMutation = useMutation({
    mutationFn: (notificationId: number) => discourseApi.markNotificationRead(notificationId),
    onSuccess: (_, notificationId) => {
      // Optimistically update the notification
      queryClient.setQueryData(['notifications'], (old: any) => {
        if (!old?.notifications) return old;
        return {
          ...old,
          notifications: old.notifications.map((n: any) =>
            n.id === notificationId ? { ...n, read: true } : n
          ),
        };
      });
    },
    onError: (error) => {
      console.error('Failed to mark notification as read:', error);
    },
  });

  // Mark all notifications as read
  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      if (!notificationsData?.notifications) return;
      
      const unreadNotifications = notificationsData.notifications.filter((n: any) => !n.read);
      await Promise.all(
        unreadNotifications.map((n: any) => discourseApi.markNotificationRead(n.id))
      );
    },
    onSuccess: () => {
      // Optimistically update all notifications
      queryClient.setQueryData(['notifications'], (old: any) => {
        if (!old?.notifications) return old;
        return {
          ...old,
          notifications: old.notifications.map((n: any) => ({ ...n, read: true })),
        };
      });
    },
    onError: (error) => {
      console.error('Failed to mark all notifications as read:', error);
    },
  });

  const notifications = notificationsData?.notifications || [];
  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return {
    // Data
    notifications,
    unreadCount,
    isLoading,
    error,

    // Actions
    markAsRead: markReadMutation.mutate,
    markAllAsRead: markAllReadMutation.mutate,
    isMarkingRead: markReadMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
  };
}
