// Course API Service
import { API_CONFIG, USE_MOCK_API, getHeaders } from './config';
import { ApiResponse, Course, Reel, CourseProgress, ReelCaptions } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from './authApi';

// Mock courses data
const MOCK_COURSES: Course[] = [
  { id: 'course_1', title: 'Mehndi Design Basics', description: 'Learn beautiful mehndi patterns', thumbnail: 'https://picsum.photos/300/200?random=1', category: 'Art', duration: 45, reelsCount: 5, instructor: 'Priya Sharma', rating: 4.8, enrolledCount: 1250, createdAt: '2024-01-15' },
  { id: 'course_2', title: 'Embroidery Masterclass', description: 'Traditional embroidery techniques', thumbnail: 'https://picsum.photos/300/200?random=2', category: 'Craft', duration: 60, reelsCount: 8, instructor: 'Lakshmi Devi', rating: 4.9, enrolledCount: 890, createdAt: '2024-02-01' },
  { id: 'course_3', title: 'Pickle Making', description: 'Homemade pickle recipes', thumbnail: 'https://picsum.photos/300/200?random=3', category: 'Food', duration: 30, reelsCount: 4, instructor: 'Anita Kumari', rating: 4.7, enrolledCount: 2100, createdAt: '2024-01-20' },
  { id: 'course_4', title: 'Candle Making', description: 'Decorative candles at home', thumbnail: 'https://picsum.photos/300/200?random=4', category: 'Craft', duration: 40, reelsCount: 6, instructor: 'Meera Patel', rating: 4.6, enrolledCount: 750, createdAt: '2024-02-10' },
  { id: 'course_5', title: 'Jewelry Design', description: 'Handmade jewelry basics', thumbnail: 'https://picsum.photos/300/200?random=5', category: 'Fashion', duration: 55, reelsCount: 7, instructor: 'Sunita Rao', rating: 4.8, enrolledCount: 1100, createdAt: '2024-01-25' },
];

const MOCK_REELS: Record<string, Reel[]> = {
  'course_1': [
    { id: 'reel_1_1', courseId: 'course_1', title: 'Introduction to Mehndi', description: 'Getting started', videoUrl: 'https://example.com/video1.mp4', thumbnail: 'https://picsum.photos/200/350?random=11', duration: 60, order: 1, captions: { hindi: 'मेहंदी का परिचय', english: 'Introduction to Mehndi', tamil: 'மெஹந்தி அறிமுகம்' } },
    { id: 'reel_1_2', courseId: 'course_1', title: 'Basic Patterns', description: 'Simple designs', videoUrl: 'https://example.com/video2.mp4', thumbnail: 'https://picsum.photos/200/350?random=12', duration: 55, order: 2, captions: { hindi: 'बुनियादी पैटर्न', english: 'Basic Patterns', tamil: 'அடிப்படை வடிவங்கள்' } },
    { id: 'reel_1_3', courseId: 'course_1', title: 'Floral Designs', description: 'Flower patterns', videoUrl: 'https://example.com/video3.mp4', thumbnail: 'https://picsum.photos/200/350?random=13', duration: 58, order: 3, captions: { hindi: 'फूलों के डिज़ाइन', english: 'Floral Designs', tamil: 'மலர் வடிவமைப்புகள்' } },
  ],
  'course_2': [
    { id: 'reel_2_1', courseId: 'course_2', title: 'Thread Selection', description: 'Choosing threads', videoUrl: 'https://example.com/video4.mp4', thumbnail: 'https://picsum.photos/200/350?random=21', duration: 50, order: 1, captions: { hindi: 'धागा चयन', english: 'Thread Selection', tamil: 'நூல் தேர்வு' } },
    { id: 'reel_2_2', courseId: 'course_2', title: 'Basic Stitches', description: 'Foundation stitches', videoUrl: 'https://example.com/video5.mp4', thumbnail: 'https://picsum.photos/200/350?random=22', duration: 60, order: 2, captions: { hindi: 'बुनियादी टांके', english: 'Basic Stitches', tamil: 'அடிப்படை தையல்கள்' } },
  ],
};

const PROGRESS_KEY = '@streeskill_progress';

export const courseApi = {
  // GET /courses - List all courses
  getCourses: async (category?: string): Promise<ApiResponse<Course[]>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      let courses = MOCK_COURSES;
      if (category) {
        courses = courses.filter(c => c.category === category);
      }
      return { success: true, data: courses };
    }
    
    const token = await authApi.getToken();
    const url = category ? `${API_CONFIG.BASE_URL}/courses?category=${category}` : `${API_CONFIG.BASE_URL}/courses`;
    const response = await fetch(url, { headers: getHeaders(token || undefined) });
    return response.json();
  },

  // GET /courses/:id - Get course details
  getCourseById: async (courseId: string): Promise<ApiResponse<Course & { reels: Reel[] }>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const course = MOCK_COURSES.find(c => c.id === courseId);
      if (!course) return { success: false, error: 'Course not found' };
      const reels = MOCK_REELS[courseId] || [];
      return { success: true, data: { ...course, reels } };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/courses/${courseId}`, { headers: getHeaders(token || undefined) });
    return response.json();
  },

  // GET /courses/:id/reels - Get course reels
  getCourseReels: async (courseId: string): Promise<ApiResponse<Reel[]>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const reels = MOCK_REELS[courseId] || [];
      return { success: true, data: reels };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/courses/${courseId}/reels`, { headers: getHeaders(token || undefined) });
    return response.json();
  },

  // POST /courses/:id/progress - Update lesson progress
  updateProgress: async (courseId: string, reelId: string): Promise<ApiResponse<CourseProgress>> => {
    if (USE_MOCK_API) {
      const progressStr = await AsyncStorage.getItem(PROGRESS_KEY);
      const allProgress: Record<string, CourseProgress> = progressStr ? JSON.parse(progressStr) : {};
      
      const courseProgress = allProgress[courseId] || { courseId, completedReels: [], progressPercent: 0 };
      if (!courseProgress.completedReels.includes(reelId)) {
        courseProgress.completedReels.push(reelId);
      }
      courseProgress.lastWatchedReelId = reelId;
      courseProgress.lastWatchedAt = new Date().toISOString();
      
      const totalReels = MOCK_REELS[courseId]?.length || 1;
      courseProgress.progressPercent = Math.round((courseProgress.completedReels.length / totalReels) * 100);
      
      allProgress[courseId] = courseProgress;
      await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
      
      return { success: true, data: courseProgress };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/courses/${courseId}/progress`, {
      method: 'POST',
      headers: getHeaders(token || undefined),
      body: JSON.stringify({ reelId }),
    });
    return response.json();
  },

  // GET /user/progress - Get user's overall progress
  getUserProgress: async (): Promise<ApiResponse<Record<string, CourseProgress>>> => {
    if (USE_MOCK_API) {
      const progressStr = await AsyncStorage.getItem(PROGRESS_KEY);
      const progress = progressStr ? JSON.parse(progressStr) : {};
      return { success: true, data: progress };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/user/progress`, { headers: getHeaders(token || undefined) });
    return response.json();
  },
};

export const reelApi = {
  // GET /reels/:id - Get reel details
  getReelById: async (reelId: string): Promise<ApiResponse<Reel>> => {
    if (USE_MOCK_API) {
      for (const reels of Object.values(MOCK_REELS)) {
        const reel = reels.find(r => r.id === reelId);
        if (reel) return { success: true, data: reel };
      }
      return { success: false, error: 'Reel not found' };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/reels/${reelId}`, { headers: getHeaders(token || undefined) });
    return response.json();
  },

  // POST /reels/:id/complete - Mark reel as completed
  markComplete: async (reelId: string, courseId: string): Promise<ApiResponse<null>> => {
    return courseApi.updateProgress(courseId, reelId).then(() => ({ success: true, data: null }));
  },

  // GET /reels/:id/captions - Get captions
  getCaptions: async (reelId: string): Promise<ApiResponse<ReelCaptions>> => {
    if (USE_MOCK_API) {
      for (const reels of Object.values(MOCK_REELS)) {
        const reel = reels.find(r => r.id === reelId);
        if (reel) return { success: true, data: reel.captions };
      }
      return { success: false, error: 'Captions not found' };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/reels/${reelId}/captions`, { headers: getHeaders(token || undefined) });
    return response.json();
  },
};
