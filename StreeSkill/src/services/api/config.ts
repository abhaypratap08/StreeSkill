// API Configuration
export const API_CONFIG = {
  // For development: use your machine's IP for physical device/emulator testing
  // localhost only works for web, use IP for mobile
  BASE_URL: __DEV__ ? 'http://10.10.174.171:3000/api/v1' : 'https://api.streeskill.com/v1',
  TIMEOUT: 10000,
  YOUTUBE_API_KEY: 'YOUR_YOUTUBE_API_KEY', // Replace with actual key
  ALGOLIA_APP_ID: 'YOUR_ALGOLIA_APP_ID',
  ALGOLIA_API_KEY: 'YOUR_ALGOLIA_API_KEY',
};

// For development, use mock mode
// Set to true to use mock data, false to connect to real backend
export const USE_MOCK_API = false; // Backend is running on localhost:3000

// API Headers
export const getHeaders = (token?: string) => ({
  'Content-Type': 'application/json',
  ...(token && { Authorization: `Bearer ${token}` }),
});
