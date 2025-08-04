// API Configuration
export const API_CONFIG = {
  // Change this to match your backend URL
  BASE_URL: 'http://localhost:8080/api',
  
  // For development with Expo Go, you might need to use your computer's IP address
  // BASE_URL: 'http://192.168.1.100:8080/api',
  
  // For production, use your deployed backend URL
  // BASE_URL: 'https://your-backend-url.com/api',
  
  TIMEOUT: 10000, // 10 seconds
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE: '/users/update',
  },
  WORKOUTS: {
    LIST: '/workouts',
    CREATE: '/workouts',
    DETAIL: (id: string) => `/workouts/${id}`,
    UPDATE: (id: string) => `/workouts/${id}`,
    DELETE: (id: string) => `/workouts/${id}`,
  },
}; 