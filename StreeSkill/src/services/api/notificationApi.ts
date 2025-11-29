// Notification API Service
import { API_CONFIG, USE_MOCK_API, getHeaders } from './config';
import { ApiResponse, Notification } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from './authApi';

const NOTIFICATIONS_KEY = '@streeskill_notifications';

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'notif_1', type: 'course', title: 'New Course Available!', message: 'Check out our new Jewelry Making course', read: false, createdAt: '2024-11-29T08:00:00Z' },
  { id: 'notif_2', type: 'order', title: 'Order Received', message: 'You have a new order for Embroidered Cushion Cover', read: false, createdAt: '2024-11-28T14:30:00Z' },
  { id: 'notif_3', type: 'community', title: 'New Reply', message: 'Someone replied to your question about mehndi', read: true, createdAt: '2024-11-27T10:15:00Z' },
  { id: 'notif_4', type: 'system', title: 'Welcome to StreeSkill!', message: 'Start your learning journey today', read: true, createdAt: '2024-11-20T09:00:00Z' },
];

export const notificationApi = {
  // GET /notifications - Get notifications
  getNotifications: async (): Promise<ApiResponse<Notification[]>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const notifStr = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      const notifications = notifStr ? JSON.parse(notifStr) : MOCK_NOTIFICATIONS;
      return { success: true, data: notifications.sort((a: Notification, b: Notification) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/notifications`, { headers: getHeaders(token || undefined) });
    return response.json();
  },

  // PUT /notifications/read - Mark as read
  markAsRead: async (notificationIds: string[]): Promise<ApiResponse<null>> => {
    if (USE_MOCK_API) {
      const notifStr = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      const notifications = notifStr ? JSON.parse(notifStr) : MOCK_NOTIFICATIONS;
      
      notifications.forEach((n: Notification) => {
        if (notificationIds.includes(n.id)) n.read = true;
      });
      
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      return { success: true, message: 'Marked as read' };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/read`, {
      method: 'PUT',
      headers: getHeaders(token || undefined),
      body: JSON.stringify({ notificationIds }),
    });
    return response.json();
  },

  // Mark all as read
  markAllAsRead: async (): Promise<ApiResponse<null>> => {
    if (USE_MOCK_API) {
      const notifStr = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      const notifications = notifStr ? JSON.parse(notifStr) : MOCK_NOTIFICATIONS;
      notifications.forEach((n: Notification) => { n.read = true; });
      await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
      return { success: true, message: 'All marked as read' };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: getHeaders(token || undefined),
    });
    return response.json();
  },

  // Get unread count
  getUnreadCount: async (): Promise<number> => {
    const result = await notificationApi.getNotifications();
    if (result.success && result.data) {
      return result.data.filter(n => !n.read).length;
    }
    return 0;
  },
};
