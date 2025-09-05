import axios from 'axios';
import { ENDPOINTS } from '../config/api';

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
      const response = await axios.post(ENDPOINTS.WORKOUTS.CREATE_SESSION, data);
      console.log('request', data);
      console.log('response.data', response.data);
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

      const response = await axios.get(`${ENDPOINTS.WORKOUTS.SESSIONS}?${params.toString()}`);
      return response.data.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('error', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch workout sessions');
      }
      throw new Error('Failed to fetch workout sessions');
    }
  },

  // Get a specific workout session by ID
  async getWorkoutSessionById(id: string): Promise<WorkoutSession> {
    try {
      const response = await axios.get(ENDPOINTS.WORKOUTS.SESSION_DETAIL(id));
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
      const response = await axios.patch(ENDPOINTS.WORKOUTS.COMPLETE_SESSION(id), { notes });
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
      await axios.delete(ENDPOINTS.WORKOUTS.DELETE_SESSION(id));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to delete workout session');
      }
      throw new Error('Failed to delete workout session');
    }
  }
}; 