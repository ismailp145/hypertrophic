import axios from 'axios';
import { ENDPOINTS, API_CONFIG } from '../config/api';

// Create a configured axios instance for this service
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  async (config) => {
    // Get token from secure store with fallback
    try {
      const SecureStore = await import('expo-secure-store');
      let token = await SecureStore.default.getItemAsync('auth_token');
      
      // If no token in SecureStore, try AsyncStorage as fallback (for development)
      if (!token) {
        try {
          const AsyncStorage = await import('@react-native-async-storage/async-storage');
          token = await AsyncStorage.default.getItem('auth_token');
          console.log('Token retrieved from AsyncStorage fallback:', token ? 'Yes' : 'No');
        } catch (fallbackError) {
          console.log('AsyncStorage fallback not available');
        }
      } else {
        console.log('Token retrieved from SecureStore:', token ? 'Yes' : 'No');
      }
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        console.log('Authorization header set successfully');
      } else {
        console.warn('No auth token found for request');
      }
    } catch (error: unknown) {
      console.error('Error getting auth token:', error);
      // Try AsyncStorage as last resort
      try {
        const AsyncStorage = await import('@react-native-async-storage/async-storage');
        const token = await AsyncStorage.default.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Token retrieved from AsyncStorage after error');
        }
      } catch (fallbackError: unknown) {
        console.error('All storage methods failed:', fallbackError);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token is invalid, could trigger logout here if needed
      console.error('Unauthorized request - token may be invalid');
    }
    return Promise.reject(error);
  }
);

export interface CreateWorkoutSessionData {
  name: string;
  notes?: string;
}

export interface WorkoutSession {
  id: number;
  userId: number;
  name: string;
  startedAt: string;
  completedAt: string | null;
  notes: string | null;
  createdAt: string;
}

// Debug function to check token status
export const debugTokenStatus = async () => {
  try {
    console.log('🔍 Debugging token status...');
    
    // Check SecureStore
    try {
      const SecureStore = await import('expo-secure-store');
      const secureToken = await SecureStore.default.getItemAsync('auth_token');
      console.log('SecureStore token:', secureToken ? 'Present' : 'Missing');
      if (secureToken) {
        console.log('Token length:', secureToken.length);
        console.log('Token starts with:', secureToken.substring(0, 20) + '...');
      }
    } catch (error: unknown) {
      console.log('SecureStore error:', error instanceof Error ? error.message : String(error));
    }
    
    // Check AsyncStorage
    try {
      const AsyncStorage = await import('@react-native-async-storage/async-storage');
      const asyncToken = await AsyncStorage.default.getItem('auth_token');
      console.log('AsyncStorage token:', asyncToken ? 'Present' : 'Missing');
      if (asyncToken) {
        console.log('Token length:', asyncToken.length);
        console.log('Token starts with:', asyncToken.substring(0, 20) + '...');
      }
    } catch (error: unknown) {
      console.log('AsyncStorage error:', error instanceof Error ? error.message : String(error));
    }
  } catch (error: unknown) {
    console.error('Debug error:', error);
  }
};

export const workoutService = {
  // Create a new workout session
  async createWorkoutSession(data: CreateWorkoutSessionData): Promise<WorkoutSession> {
    try {
      const response = await apiClient.post(ENDPOINTS.WORKOUTS.CREATE_SESSION, data);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to create workout session');
      }
      throw new Error('Failed to create workout session');
    }
  },

  // Get all workout sessions for the current user
  async getWorkoutSessions(limit: number = 10, offset: number = 0, completed?: boolean): Promise<WorkoutSession[]> {
    try {
      const params = new URLSearchParams();
      if (limit) params.append('limit', limit.toString());
      if (offset) params.append('offset', offset.toString());
      if (completed !== undefined) params.append('completed', completed.toString());

      const response = await apiClient.get(`${ENDPOINTS.WORKOUTS.SESSIONS}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch workout sessions');
      }
      throw new Error('Failed to fetch workout sessions');
    }
  },

  // Get a specific workout session by ID
  async getWorkoutSessionById(id: string): Promise<WorkoutSession> {
    try {
      const response = await apiClient.get(ENDPOINTS.WORKOUTS.SESSION_DETAIL(id));
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch workout session');
      }
      throw new Error('Failed to fetch workout session');
    }
  },

  // Complete a workout session
  async completeWorkoutSession(id: string, notes?: string): Promise<WorkoutSession> {
    try {
      const response = await apiClient.patch(ENDPOINTS.WORKOUTS.COMPLETE_SESSION(id), { notes });
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to complete workout session');
      }
      throw new Error('Failed to complete workout session');
    }
  },

  // Delete a workout session
  async deleteWorkoutSession(id: string): Promise<void> {
    try {
      await apiClient.delete(ENDPOINTS.WORKOUTS.DELETE_SESSION(id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to delete workout session');
      }
      throw new Error('Failed to delete workout session');
    }
  }
}; 