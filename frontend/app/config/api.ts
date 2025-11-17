// API Configuration
export const API_CONFIG = {
  // For development - change this to your computer's IP address if testing on device
  // BASE_URL: 'http://localhost:8080/api',
  
  // For testing on physical device, use your computer's IP:
  BASE_URL: 'http://10.0.0.74:8080/api',
  
  // For production, use your deployed backend URL
  // BASE_URL: 'https://your-backend-url.com/api',
  
  TIMEOUT: 10000, // 10 seconds
};

// Helper function to get your computer's IP address
export const getLocalIP = () => {
  // You can find your IP by running: ifconfig | grep "inet " | grep -v 127.0.0.1
  // On macOS/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
  // On Windows: ipconfig | findstr "IPv4"
  return '10.0.0.74'; // Your actual IP address
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
    SESSIONS: '/workouts/sessions',
    CREATE_SESSION: '/workouts/sessions',
    SESSION_DETAIL: (id: string) => `/workouts/sessions/${id}`,
    UPDATE_SESSION: (id: string) => `/workouts/sessions/${id}`,
    DELETE_SESSION: (id: string) => `/workouts/sessions/${id}`,
    COMPLETE_SESSION: (id: string) => `/workouts/sessions/${id}/complete`,
    EXERCISES: '/workouts/exercises',
    EXERCISE_DETAIL: (id: string) => `/workouts/exercises/${id}`,
  },
}; 
