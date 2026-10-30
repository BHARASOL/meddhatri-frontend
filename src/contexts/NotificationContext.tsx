import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient from '../api/client.js';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'APPLICATION' | 'INTERVIEW' | 'AI_MATCH' | 'VERIFICATION' | 'MESSAGE';
  time: string;
  isRead: boolean;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notif: Omit<AppNotification, 'id' | 'time' | 'isRead'>) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const loadNotifications = () => {
    apiClient.get('/notifications')
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          const list: AppNotification[] = res.data.map((n: any) => ({
            id: n.id,
            title: n.title || 'Notification',
            message: n.message || '',
            type: n.type || 'APPLICATION',
            time: n.created_at ? new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            isRead: !!n.is_read
          }));
          setNotifications(list);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.warn('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    try {
      await apiClient.patch('/notifications/read-all');
    } catch (err) {
      console.warn('Failed to mark all notifications as read:', err);
    }
  };

  const addNotification = (notif: Omit<AppNotification, 'id' | 'time' | 'isRead'>) => {
    const newEntry: AppNotification = {
      ...notif,
      id: `notif_${Date.now()}`,
      time: 'Just now',
      isRead: false
    };
    setNotifications(prev => [newEntry, ...prev]);
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};

export const useNotification = useNotifications;
