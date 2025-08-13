import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as workoutService from '../services/workoutService';

export class WorkoutController {
  
  // ===== WORKOUT SESSIONS =====

  async createWorkoutSession(req: AuthenticatedRequest, res: Response): Promise<Response | void> {
    try {
      const { name, notes } = req.body;
      const userId = req.user!.id;

      const newSession = await workoutService.createWorkoutSession({
        userId,
        name,
        notes
      });

      res.status(201).json({
        success: true,
        message: 'Workout session created successfully',
        data: newSession
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create workout session',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getWorkoutSessions(req: AuthenticatedRequest, res: Response): Promise<Response | void> {
    try {
      const userId = req.user!.id;
      const { limit = 10, offset = 0, completed } = req.query;

      const sessions = await workoutService.getWorkoutSessions(
        userId, 
        Number(limit), 
        Number(offset), 
        completed !== undefined ? Boolean(completed) : undefined
      );

      res.status(200).json({
        success: true,
        message: 'Workout sessions retrieved successfully',
        data: sessions,
        pagination: {
          limit: Number(limit),
          offset: Number(offset),
          total: sessions.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve workout sessions',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getWorkoutSessionById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const sessionId = parseInt(req.params.id);

      const sessionWithExercises = await workoutService.getWorkoutSessionById(userId, sessionId);

      res.status(200).json({
        success: true,
        message: 'Workout session retrieved successfully',
        data: sessionWithExercises
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Workout session not found') {
        res.status(404).json({
          success: false,
          message: 'Workout session not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve workout session',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateWorkoutSession(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const sessionId = parseInt(req.params.id);
      const updateData = req.body;

      const updatedSession = await workoutService.updateWorkoutSession(userId, sessionId, updateData);

      res.status(200).json({
        success: true,
        message: 'Workout session updated successfully',
        data: updatedSession
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Workout session not found') {
        res.status(404).json({
          success: false,
          message: 'Workout session not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to update workout session',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async completeWorkoutSession(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const sessionId = parseInt(req.params.id);
      const { notes } = req.body;

      const completedSession = await workoutService.completeWorkoutSession(userId, sessionId, notes);

      res.status(200).json({
        success: true,
        message: 'Workout session completed successfully',
        data: completedSession
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Workout session not found') {
        res.status(404).json({
          success: false,
          message: 'Workout session not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to complete workout session',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteWorkoutSession(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const sessionId = parseInt(req.params.id);

      await workoutService.deleteWorkoutSession(userId, sessionId);

      res.status(200).json({
        success: true,
        message: 'Workout session deleted successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Workout session not found') {
        res.status(404).json({
          success: false,
          message: 'Workout session not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to delete workout session',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // ===== EXERCISES IN WORKOUTS =====

  async addExerciseToWorkout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const workoutSessionId = parseInt(req.params.workoutSessionId);
      const { exerciseId, order, restTimeSeconds, notes } = req.body;

      const newWorkoutExercise = await workoutService.addExerciseToWorkout(userId, {
        workoutSessionId,
        exerciseId,
        order,
        restTimeSeconds,
        notes
      });

      res.status(201).json({
        success: true,
        message: 'Exercise added to workout successfully',
        data: newWorkoutExercise
      });
    } catch (error) {
      if (error instanceof Error && (error.message === 'Workout session not found' || error.message === 'Exercise not found')) {
        res.status(404).json({
          success: false,
          message: error.message
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to add exercise to workout',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateWorkoutExercise(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const workoutExerciseId = parseInt(req.params.id);
      const updateData = req.body;

      const updatedWorkoutExercise = await workoutService.updateWorkoutExercise(userId, workoutExerciseId, updateData);

      res.status(200).json({
        success: true,
        message: 'Workout exercise updated successfully',
        data: updatedWorkoutExercise
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Workout exercise not found') {
        res.status(404).json({
          success: false,
          message: 'Workout exercise not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to update workout exercise',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async removeExerciseFromWorkout(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const workoutExerciseId = parseInt(req.params.id);

      await workoutService.removeExerciseFromWorkout(userId, workoutExerciseId);

      res.status(200).json({
        success: true,
        message: 'Exercise removed from workout successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Workout exercise not found') {
        res.status(404).json({
          success: false,
          message: 'Workout exercise not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to remove exercise from workout',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // ===== EXERCISE SETS =====

  async addSetToExercise(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const workoutExerciseId = parseInt(req.params.workoutExerciseId);
      const { setNumber, reps, weight, restTimeSeconds, notes } = req.body;

      const newSet = await workoutService.addSetToExercise(userId, workoutExerciseId, {
        workoutExerciseId,
        setNumber,
        reps,
        weight,
        restTimeSeconds,
        notes
      });

      res.status(201).json({
        success: true,
        message: 'Set added successfully',
        data: newSet
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Workout exercise not found') {
        res.status(404).json({
          success: false,
          message: 'Workout exercise not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to add set to exercise',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async updateExerciseSet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const setId = parseInt(req.params.id);
      const updateData = req.body;

      const updatedSet = await workoutService.updateExerciseSet(userId, setId, updateData);

      res.status(200).json({
        success: true,
        message: 'Exercise set updated successfully',
        data: updatedSet
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Exercise set not found') {
        res.status(404).json({
          success: false,
          message: 'Exercise set not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to update exercise set',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async deleteExerciseSet(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.id;
      const setId = parseInt(req.params.id);

      await workoutService.deleteExerciseSet(userId, setId);

      res.status(200).json({
        success: true,
        message: 'Exercise set deleted successfully'
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Exercise set not found') {
        res.status(404).json({
          success: false,
          message: 'Exercise set not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to delete exercise set',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  // ===== EXERCISE CATALOG =====

  async getAllExercises(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const exercises = await workoutService.getAllExercises();

      res.status(200).json({
        success: true,
        message: 'Exercises retrieved successfully',
        data: exercises
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve exercises',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async getExerciseById(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const exerciseId = parseInt(req.params.id);

      const exercise = await workoutService.getExerciseById(exerciseId);

      res.status(200).json({
        success: true,
        message: 'Exercise retrieved successfully',
        data: exercise
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'Exercise not found') {
        res.status(404).json({
          success: false,
          message: 'Exercise not found'
        });
        return;
      }
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve exercise',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 