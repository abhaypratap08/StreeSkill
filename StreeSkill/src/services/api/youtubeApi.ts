import { API_CONFIG, getHeaders } from './config';
import { ApiResponse } from './types';
import { authApi } from './authApi';

export interface YouTubeShort {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  publishedAt: string;
  videoUrl: string;
  duration?: string;
  viewCount?: string;
  likeCount?: string;
}

export interface YouTubeShortsResponse {
  data: YouTubeShort[];
  source: 'youtube' | 'mock';
}

// Skill categories for YouTube Shorts
export type SkillCategory = 
  | 'tailoring' | 'embroidery' | 'knitting' | 'mehendi' 
  | 'baking' | 'beauty' | 'packaging' | 'beadwork' 
  | 'macrame' | 'candles' | 'quilling' | 'meesho' 
  | 'cooking' | 'pottery' | 'rangoli' | 'soap';

/**
 * YouTube Shorts API for fetching skill tutorial videos
 */
export const youtubeApi = {
  /**
   * Get YouTube Shorts for a specific skill category
   */
  getShortsByCategory: async (
    category: SkillCategory, 
    maxResults: number = 10
  ): Promise<ApiResponse<YouTubeShortsResponse>> => {
    try {
      const token = await authApi.getToken();
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/youtube/shorts/${category}?maxResults=${maxResults}`,
        { headers: getHeaders(token || undefined) }
      );
      return response.json();
    } catch (error) {
      console.error('Error fetching YouTube shorts:', error);
      return { success: false, error: 'Failed to fetch videos' };
    }
  },

  /**
   * Search YouTube Shorts by custom query
   */
  searchShorts: async (
    query: string, 
    maxResults: number = 10
  ): Promise<ApiResponse<YouTubeShortsResponse>> => {
    try {
      const token = await authApi.getToken();
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/youtube/search?q=${encodeURIComponent(query)}&maxResults=${maxResults}`,
        { headers: getHeaders(token || undefined) }
      );
      return response.json();
    } catch (error) {
      console.error('Error searching YouTube shorts:', error);
      return { success: false, error: 'Failed to search videos' };
    }
  },

  /**
   * Get video details by ID
   */
  getVideoDetails: async (videoId: string): Promise<ApiResponse<YouTubeShort>> => {
    try {
      const token = await authApi.getToken();
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/youtube/video/${videoId}`,
        { headers: getHeaders(token || undefined) }
      );
      return response.json();
    } catch (error) {
      console.error('Error fetching video details:', error);
      return { success: false, error: 'Failed to fetch video details' };
    }
  },

  /**
   * Get trending skill tutorial shorts
   */
  getTrendingShorts: async (maxResults: number = 20): Promise<ApiResponse<YouTubeShortsResponse>> => {
    try {
      const token = await authApi.getToken();
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/youtube/trending?maxResults=${maxResults}`,
        { headers: getHeaders(token || undefined) }
      );
      return response.json();
    } catch (error) {
      console.error('Error fetching trending shorts:', error);
      return { success: false, error: 'Failed to fetch trending videos' };
    }
  },

  /**
   * Get shorts for multiple categories (for dashboard)
   */
  getShortsForDashboard: async (): Promise<Record<SkillCategory, YouTubeShort[]>> => {
    const categories: SkillCategory[] = ['mehendi', 'embroidery', 'tailoring', 'baking', 'beauty', 'candles'];
    const results: Record<string, YouTubeShort[]> = {};

    await Promise.all(
      categories.map(async (category) => {
        const response = await youtubeApi.getShortsByCategory(category, 5);
        if (response.success && response.data) {
          results[category] = response.data.data;
        } else {
          results[category] = [];
        }
      })
    );

    return results as Record<SkillCategory, YouTubeShort[]>;
  },

  /**
   * Extract video ID from various YouTube URL formats
   */
  extractVideoId: (url: string): string | null => {
    if (url.startsWith('youtube:')) {
      return url.replace('youtube:', '');
    }
    
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
      /^([a-zA-Z0-9_-]{11})$/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }

    return null;
  },

  /**
   * Get YouTube thumbnail URL for a video ID
   */
  getThumbnailUrl: (videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres' = 'high'): string => {
    const qualityMap = {
      default: 'default',
      medium: 'mqdefault',
      high: 'hqdefault',
      maxres: 'maxresdefault',
    };
    return `https://img.youtube.com/vi/${videoId}/${qualityMap[quality]}.jpg`;
  },

  /**
   * Format video URL for the player
   */
  formatVideoUrl: (videoId: string): string => {
    return `youtube:${videoId}`;
  },
};

export default youtubeApi;
