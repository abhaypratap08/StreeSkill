// API Response Types

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  notifications: boolean;
  autoPlay: boolean;
  downloadOverWifi: boolean;
  language: string;
  captionLanguages: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

// Course Types
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  duration: number;
  reelsCount: number;
  instructor: string;
  rating: number;
  enrolledCount: number;
  createdAt: string;
}

export interface Reel {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail: string;
  duration: number;
  order: number;
  captions: ReelCaptions;
}

export interface ReelCaptions {
  hindi?: string;
  english?: string;
  tamil?: string;
}

export interface CourseProgress {
  courseId: string;
  completedReels: string[];
  lastWatchedReelId?: string;
  lastWatchedAt?: string;
  progressPercent: number;
}

export interface UserStats {
  totalSessions: number;
  minutesLearned: number;
  longestStreak: number;
  currentStreak: number;
  coursesCompleted: number;
  coursesInProgress: number;
}

// Community Types
export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  title: string;
  content: string;
  category: string;
  upvotes: number;
  downvotes: number;
  repliesCount: number;
  createdAt: string;
  userVote?: 'up' | 'down' | null;
}

export interface PostReply {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: string;
  userVote?: 'up' | 'down' | null;
}

// Marketplace Types
export interface Product {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  status: 'active' | 'sold' | 'inactive';
  createdAt: string;
}

export interface Order {
  id: string;
  productId: string;
  productTitle: string;
  buyerId: string;
  buyerName: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface Earnings {
  totalEarnings: number;
  thisMonth: number;
  pendingPayouts: number;
  completedOrders: number;
  recentTransactions: Transaction[];
}

export interface Transaction {
  id: string;
  type: 'sale' | 'payout';
  amount: number;
  description: string;
  createdAt: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'course' | 'community' | 'order' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  data?: Record<string, unknown>;
}

// Search Types
export interface SearchResult {
  courses: Course[];
  products: Product[];
  posts: CommunityPost[];
}

export interface SearchSuggestion {
  text: string;
  type: 'course' | 'product' | 'trending';
}
