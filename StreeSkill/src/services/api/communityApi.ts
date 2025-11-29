// Community API Service
import { API_CONFIG, USE_MOCK_API, getHeaders } from './config';
import { ApiResponse, CommunityPost, PostReply } from './types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from './authApi';

const POSTS_KEY = '@streeskill_posts';
const REPLIES_KEY = '@streeskill_replies';

// Mock posts
const MOCK_POSTS: CommunityPost[] = [
  { id: 'post_1', userId: 'user_1', userName: 'Priya M.', title: 'Best mehndi cone brand?', content: 'Which brand gives the darkest color? I tried several but not satisfied.', category: 'Mehndi', upvotes: 24, downvotes: 2, repliesCount: 8, createdAt: '2024-11-28T10:30:00Z', userVote: null },
  { id: 'post_2', userId: 'user_2', userName: 'Lakshmi K.', title: 'Embroidery thread storage tips', content: 'How do you all organize your threads? Mine always get tangled!', category: 'Embroidery', upvotes: 18, downvotes: 1, repliesCount: 5, createdAt: '2024-11-27T15:45:00Z', userVote: null },
  { id: 'post_3', userId: 'user_3', userName: 'Anita S.', title: 'Pickle shelf life question', content: 'How long can homemade mango pickle last? Any preservation tips?', category: 'Food', upvotes: 31, downvotes: 0, repliesCount: 12, createdAt: '2024-11-26T09:15:00Z', userVote: null },
];

const MOCK_REPLIES: Record<string, PostReply[]> = {
  'post_1': [
    { id: 'reply_1_1', postId: 'post_1', userId: 'user_4', userName: 'Sunita R.', content: 'I recommend Prem Dulhan brand, gives amazing dark color!', upvotes: 12, downvotes: 0, createdAt: '2024-11-28T11:00:00Z', userVote: null },
    { id: 'reply_1_2', postId: 'post_1', userId: 'user_5', userName: 'Meera P.', content: 'Try adding eucalyptus oil for darker stain', upvotes: 8, downvotes: 1, createdAt: '2024-11-28T12:30:00Z', userVote: null },
  ],
};

export const communityApi = {
  // GET /community/posts - List posts
  getPosts: async (category?: string): Promise<ApiResponse<CommunityPost[]>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const postsStr = await AsyncStorage.getItem(POSTS_KEY);
      let posts = postsStr ? JSON.parse(postsStr) : MOCK_POSTS;
      if (category && category !== 'All') {
        posts = posts.filter((p: CommunityPost) => p.category === category);
      }
      return { success: true, data: posts.sort((a: CommunityPost, b: CommunityPost) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) };
    }
    
    const token = await authApi.getToken();
    const url = category ? `${API_CONFIG.BASE_URL}/community/posts?category=${category}` : `${API_CONFIG.BASE_URL}/community/posts`;
    const response = await fetch(url, { headers: getHeaders(token || undefined) });
    return response.json();
  },

  // POST /community/posts - Create post
  createPost: async (data: { title: string; content: string; category: string }): Promise<ApiResponse<CommunityPost>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newPost: CommunityPost = {
        id: `post_${Date.now()}`,
        userId: 'current_user',
        userName: 'You',
        title: data.title,
        content: data.content,
        category: data.category,
        upvotes: 0,
        downvotes: 0,
        repliesCount: 0,
        createdAt: new Date().toISOString(),
        userVote: null,
      };
      
      const postsStr = await AsyncStorage.getItem(POSTS_KEY);
      const posts = postsStr ? JSON.parse(postsStr) : MOCK_POSTS;
      posts.unshift(newPost);
      await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      
      return { success: true, data: newPost, message: 'Post created successfully' };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/community/posts`, {
      method: 'POST',
      headers: getHeaders(token || undefined),
      body: JSON.stringify(data),
    });
    return response.json();
  },

  // GET /community/posts/:id/replies - Get replies
  getReplies: async (postId: string): Promise<ApiResponse<PostReply[]>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const repliesStr = await AsyncStorage.getItem(REPLIES_KEY);
      const allReplies = repliesStr ? JSON.parse(repliesStr) : MOCK_REPLIES;
      const replies = allReplies[postId] || [];
      return { success: true, data: replies };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/community/posts/${postId}/replies`, { headers: getHeaders(token || undefined) });
    return response.json();
  },

  // POST /community/posts/:id/reply - Reply to post
  createReply: async (postId: string, content: string): Promise<ApiResponse<PostReply>> => {
    if (USE_MOCK_API) {
      await new Promise(resolve => setTimeout(resolve, 400));
      const newReply: PostReply = {
        id: `reply_${Date.now()}`,
        postId,
        userId: 'current_user',
        userName: 'You',
        content,
        upvotes: 0,
        downvotes: 0,
        createdAt: new Date().toISOString(),
        userVote: null,
      };
      
      const repliesStr = await AsyncStorage.getItem(REPLIES_KEY);
      const allReplies = repliesStr ? JSON.parse(repliesStr) : MOCK_REPLIES;
      if (!allReplies[postId]) allReplies[postId] = [];
      allReplies[postId].push(newReply);
      await AsyncStorage.setItem(REPLIES_KEY, JSON.stringify(allReplies));
      
      // Update post reply count
      const postsStr = await AsyncStorage.getItem(POSTS_KEY);
      const posts = postsStr ? JSON.parse(postsStr) : MOCK_POSTS;
      const postIndex = posts.findIndex((p: CommunityPost) => p.id === postId);
      if (postIndex >= 0) {
        posts[postIndex].repliesCount++;
        await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      }
      
      return { success: true, data: newReply, message: 'Reply posted' };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/community/posts/${postId}/reply`, {
      method: 'POST',
      headers: getHeaders(token || undefined),
      body: JSON.stringify({ content }),
    });
    return response.json();
  },

  // POST /community/posts/:id/vote - Vote on post
  vote: async (postId: string, voteType: 'up' | 'down'): Promise<ApiResponse<{ upvotes: number; downvotes: number }>> => {
    if (USE_MOCK_API) {
      const postsStr = await AsyncStorage.getItem(POSTS_KEY);
      const posts = postsStr ? JSON.parse(postsStr) : MOCK_POSTS;
      const postIndex = posts.findIndex((p: CommunityPost) => p.id === postId);
      
      if (postIndex >= 0) {
        const post = posts[postIndex];
        if (post.userVote === voteType) {
          // Remove vote
          if (voteType === 'up') post.upvotes--;
          else post.downvotes--;
          post.userVote = null;
        } else {
          // Change or add vote
          if (post.userVote === 'up') post.upvotes--;
          if (post.userVote === 'down') post.downvotes--;
          if (voteType === 'up') post.upvotes++;
          else post.downvotes++;
          post.userVote = voteType;
        }
        await AsyncStorage.setItem(POSTS_KEY, JSON.stringify(posts));
        return { success: true, data: { upvotes: post.upvotes, downvotes: post.downvotes } };
      }
      return { success: false, error: 'Post not found' };
    }
    
    const token = await authApi.getToken();
    const response = await fetch(`${API_CONFIG.BASE_URL}/community/posts/${postId}/vote`, {
      method: 'POST',
      headers: getHeaders(token || undefined),
      body: JSON.stringify({ voteType }),
    });
    return response.json();
  },
};
