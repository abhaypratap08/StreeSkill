// Analytics API Service
import { API_CONFIG, USE_MOCK_API, getHeaders } from './config';
import { ApiResponse } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from './authApi';

const EVENTS_KEY = '@streeskill_events';

export interface AnalyticsEvent {
  id: string;
  eventType: string;
  eventData: Record<string, unknown>;
  timestamp: string;
  userId?: string;
}

export interface AnalyticsDashboard {
  totalViews: number;
  totalWatchTime: number;
  completionRate: number;
  popularCourses: { courseId: string; title: string; views: number }[];
  weeklyActivity: { day: string; minutes: number }[];
}

export const analyticsApi = {
  // POST /analytics/event - Track event
  trackEvent: async (eventType: string, eventData: Record<string, unknown> = {}): Promise<ApiResponse<null>> => {
    if (USE_MOCK_API) {
      const event: AnalyticsEvent = {
        id: `event_${Date.now()}`,
        eventType,
        eventData,
        timestamp: new Date().toISOString(),
      };
      
      const eventsStr = await AsyncStorage.getItem(EVENTS_KEY);
      const events = eventsStr ? JSON.parse(eventsStr) : [];
      events.push(event);
      
      // Keep only last 100 events
      if (events.length > 100) events.shift();
      await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
      
      console.log('[Analytics]', eventType, eventData);
      return { success: true };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/analytics/event`, {
      method: 'POST',
      headers: getHeaders(token || undefined),
      body: JSON.stringify({ eventType, eventData, timestamp: new Date().toISOString() }),
    });
    return response.json();
  },

  // GET /analytics/dashboard - Get analytics
  getDashboard: async (): Promise<ApiResponse<AnalyticsDashboard>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const mockDashboard: AnalyticsDashboard = {
        totalViews: 156,
        totalWatchTime: 2340,
        completionRate: 68,
        popularCourses: [
          { courseId: 'course_1', title: 'Mehndi Design Basics', views: 45 },
          { courseId: 'course_3', title: 'Pickle Making', views: 38 },
          { courseId: 'course_2', title: 'Embroidery Masterclass', views: 32 },
        ],
        weeklyActivity: [
          { day: 'Mon', minutes: 25 },
          { day: 'Tue', minutes: 40 },
          { day: 'Wed', minutes: 15 },
          { day: 'Thu', minutes: 55 },
          { day: 'Fri', minutes: 30 },
          { day: 'Sat', minutes: 45 },
          { day: 'Sun', minutes: 20 },
        ],
      };
      return { success: true, data: mockDashboard };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/analytics/dashboard`, { headers: getHeaders(token || undefined) });
    return response.json();
  },

  // Common event types
  events: {
    SCREEN_VIEW: 'screen_view',
    COURSE_START: 'course_start',
    COURSE_COMPLETE: 'course_complete',
    REEL_WATCH: 'reel_watch',
    REEL_COMPLETE: 'reel_complete',
    SEARCH: 'search',
    PRODUCT_VIEW: 'product_view',
    PRODUCT_LIST: 'product_list',
    ORDER_PLACED: 'order_placed',
    POST_CREATE: 'post_create',
    POST_REPLY: 'post_reply',
    LOGIN: 'login',
    SIGNUP: 'signup',
    LOGOUT: 'logout',
  },
};
