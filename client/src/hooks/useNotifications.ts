import { useState, useEffect } from 'react';
import { getUserNotifications, markNotificationAsRead } from '@/lib/firebase';
import { useAuth } from '@/hooks/useAuth';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const userNotifications = await getUserNotifications(user.firebaseUid);
      setNotifications(userNotifications);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getUnreadCount = () => {
    return notifications.filter(notif => !notif.read).length;
  };

  return {
    notifications,
    loading,
    markAsRead,
    getUnreadCount,
    refetch: loadNotifications,
  };
};