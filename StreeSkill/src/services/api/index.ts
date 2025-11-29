// API Services - Main Export
export * from './types';
export * from './config';
export { authApi } from './authApi';
export { courseApi, reelApi } from './courseApi';
export { userApi } from './userApi';
export { communityApi } from './communityApi';
export { marketplaceApi } from './marketplaceApi';
export { notificationApi } from './notificationApi';
export { analyticsApi } from './analyticsApi';
export { searchApi } from './searchApi';
export { youtubeApi } from './youtubeApi';

// API Summary:
// 
// 🔐 Authentication (authApi)
// - register(email, password, name) - User signup
// - login(email, password) - User login
// - logout() - Logout
// - forgotPassword(email) - Password reset
// - getCurrentUser() - Get current user profile
// - isAuthenticated() - Check auth status
// - getToken() - Get stored token
//
// 📚 Courses (courseApi)
// - getCourses(category?) - List all courses
// - getCourseById(id) - Get course details with reels
// - getCourseReels(id) - Get course lessons/reels
// - updateProgress(courseId, reelId) - Update lesson progress
// - getUserProgress() - Get user's overall progress
//
// 🎬 Reels (reelApi)
// - getReelById(id) - Get reel details + video URL
// - markComplete(reelId, courseId) - Mark reel as completed
// - getCaptions(reelId) - Get captions (Hindi/English/Tamil)
//
// 👤 User Profile (userApi)
// - updateProfile(name?, avatar?) - Update profile
// - changePassword(current, new) - Change password
// - updateSettings(preferences) - Update preferences
// - getStats() - Get learning stats
//
// 💬 Community (communityApi)
// - getPosts(category?) - List Q&A posts
// - createPost(title, content, category) - Create new question
// - getReplies(postId) - Get post replies
// - createReply(postId, content) - Reply to post
// - vote(postId, 'up'|'down') - Upvote/downvote
//
// 🛒 Marketplace (marketplaceApi)
// - getProducts() - List user's products
// - createProduct(data) - Create product listing
// - updateProduct(id, data) - Update product
// - deleteProduct(id) - Remove product
// - getOrders() - Get seller orders
// - getEarnings() - Get earnings summary
//
// 🔔 Notifications (notificationApi)
// - getNotifications() - Get user notifications
// - markAsRead(ids) - Mark as read
// - markAllAsRead() - Mark all as read
// - getUnreadCount() - Get unread count
//
// 📊 Analytics (analyticsApi)
// - trackEvent(type, data) - Track user events
// - getDashboard() - Get learning analytics
//
// 🔍 Search (searchApi)
// - search(query) - Search courses, products, posts
// - getSuggestions(query) - Autocomplete suggestions
// - getRecommendations() - Recommended courses
// - getTrending() - Trending content
