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
    // Get token from secure store
    try {
      const SecureStore = await import('expo-secure-store');
      const token = await SecureStore.default.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
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