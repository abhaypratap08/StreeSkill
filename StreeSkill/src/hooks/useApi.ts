// Custom hooks for API calls
import { useState, useCallback } from 'react';
import { Alert } from 'react-native';
import { 
  authApi, courseApi, reelApi, userApi, 
  communityApi, marketplaceApi, notificationApi, 
  analyticsApi, searchApi,
  ApiResponse 
} from '../services/api';

// Generic hook for API calls with loading and error states
export function useApiCall<T, Args extends unknown[]>(
  apiFunction: (...args: Args) => Promise<ApiResponse<T>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const execute = useCallback(async (...args: Args): Promise<ApiResponse<T>> => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFunction(...args);
      if (result.success && result.data) {
        setData(result.data);
      } else if (result.error) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { execute, loading, error, data, reset };
}

// Auth hooks
export const useAuth = () => {
  const login = useApiCall(authApi.login);
  const register = useApiCall(authApi.register);
  const logout = useApiCall(authApi.logout);
  const forgotPassword = useApiCall(authApi.forgotPassword);
  const getCurrentUser = useApiCall(authApi.getCurrentUser);

  return { login, register, logout, forgotPassword, getCurrentUser };
};

// Course hooks
export const useCourses = () => {
  const getCourses = useApiCall(courseApi.getCourses);
  const getCourseById = useApiCall(courseApi.getCourseById);
  const getCourseReels = useApiCall(courseApi.getCourseReels);
  const updateProgress = useApiCall(courseApi.updateProgress);
  const getUserProgress = useApiCall(courseApi.getUserProgress);

  return { getCourses, getCourseById, getCourseReels, updateProgress, getUserProgress };
};

// Reel hooks
export const useReels = () => {
  const getReelById = useApiCall(reelApi.getReelById);
  const markComplete = useApiCall(reelApi.markComplete);
  const getCaptions = useApiCall(reelApi.getCaptions);

  return { getReelById, markComplete, getCaptions };
};

// User hooks
export const useUser = () => {
  const updateProfile = useApiCall(userApi.updateProfile);
  const changePassword = useApiCall(userApi.changePassword);
  const updateSettings = useApiCall(userApi.updateSettings);
  const getStats = useApiCall(userApi.getStats);

  return { updateProfile, changePassword, updateSettings, getStats };
};

// Community hooks
export const useCommunity = () => {
  const getPosts = useApiCall(communityApi.getPosts);
  const createPost = useApiCall(communityApi.createPost);
  const getReplies = useApiCall(communityApi.getReplies);
  const createReply = useApiCall(communityApi.createReply);
  const vote = useApiCall(communityApi.vote);

  return { getPosts, createPost, getReplies, createReply, vote };
};

// Marketplace hooks
export const useMarketplace = () => {
  const getProducts = useApiCall(marketplaceApi.getProducts);
  const createProduct = useApiCall(marketplaceApi.createProduct);
  const updateProduct = useApiCall(marketplaceApi.updateProduct);
  const deleteProduct = useApiCall(marketplaceApi.deleteProduct);
  const getOrders = useApiCall(marketplaceApi.getOrders);
  const getEarnings = useApiCall(marketplaceApi.getEarnings);

  return { getProducts, createProduct, updateProduct, deleteProduct, getOrders, getEarnings };
};

// Notification hooks
export const useNotifications = () => {
  const getNotifications = useApiCall(notificationApi.getNotifications);
  const markAsRead = useApiCall(notificationApi.markAsRead);
  const markAllAsRead = useApiCall(notificationApi.markAllAsRead);

  return { getNotifications, markAsRead, markAllAsRead };
};

// Search hooks
export const useSearch = () => {
  const search = useApiCall(searchApi.search);
  const getSuggestions = useApiCall(searchApi.getSuggestions);
  const getRecommendations = useApiCall(searchApi.getRecommendations);
  const getTrending = useApiCall(searchApi.getTrending);

  return { search, getSuggestions, getRecommendations, getTrending };
};

// Analytics helper (no hook needed, just track)
export const trackEvent = (eventType: string, eventData?: Record<string, unknown>) => {
  analyticsApi.trackEvent(eventType, eventData).catch(console.error);
};

// Show API error alert
export const showApiError = (error: string | null, fallback = 'Something went wrong') => {
  Alert.alert('Error', error || fallback);
};
