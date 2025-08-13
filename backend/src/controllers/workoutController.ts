import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { db } from '../config/database';
import { 
  workoutSessionsTable, 
  exercisesTable, 
  workoutExercisesTable, 
  exerciseSetsTable 
} from '../db/schema';
import { eq, and, desc, asc, isNull, isNotNull } from 'drizzle-orm';
import { logger } from '../utils/logger';

export class WorkoutController {
  
  // ===== WORKOUT SESSIONS =====

  async createWorkoutSession(req: AuthenticatedRequest, res: Response): Promise<Response | void> {
    try {
      const { name, notes } = req.body;
      const userId = req.user!.id;

      const [newSession] = await db.insert(workoutSessionsTable)
        .values({
          userId,
          name,
          notes,
          startedAt: new Date(),
        })
        .returning();

      logger.info(`User ${userId} created workout session: ${newSession.id}`);

      res.status(201).json({
        success: true,
        message: 'Workout session created successfully',
        data: newSession
      });
    } catch (error) {
      logger.error('Error creating workout session:', error);
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

      let whereClause = eq(workoutSessionsTable.userId, userId);
      
      if (completed !== undefined) {
        if (completed) {
          whereClause = and(whereClause, isNull(workoutSessionsTable.completedAt))!;
        } else {
          whereClause = and(whereClause, isNotNull(workoutSessionsTable.completedAt))!;
        }
      }

      const sessions = await db.select()
        .from(workoutSessionsTable)
        .where(whereClause)
        .orderBy(desc(workoutSessionsTable.startedAt))
        .limit(Number(limit))
        .offset(Number(offset));

      logger.info(`User ${userId} retrieved ${sessions.length} workout sessions`);

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
      logger.error('Error retrieving workout sessions:', error);
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

      const session = await db.select()
        .from(workoutSessionsTable)
        .where(and(
          eq(workoutSessionsTable.id, sessionId),
          eq(workoutSessionsTable.userId, userId)
        ))
        .limit(1);

      if (session.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Workout session not found'
        });
        return;
      }

      // Get exercises for this session
      const exercises = await db.select()
        .from(workoutExercisesTable)
        .where(eq(workoutExercisesTable.workoutSessionId, sessionId))
        .orderBy(asc(workoutExercisesTable.order));

      // Get sets for each exercise
      const sessionWithExercises = {
        ...session[0],
        exercises: await Promise.all(
          exercises.map(async (exercise) => {
            const sets = await db.select()
              .from(exerciseSetsTable)
              .where(eq(exerciseSetsTable.workoutExerciseId, exercise.id))
              .orderBy(asc(exerciseSetsTable.setNumber));

            return {
              ...exercise,
              sets
            };
          })
        )
      };

      logger.info(`User ${userId} retrieved workout session: ${sessionId}`);

      res.status(200).json({
        success: true,
        message: 'Workout session retrieved successfully',
        data: sessionWithExercises
      });
    } catch (error) {
      logger.error('Error retrieving workout session:', error);
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

      // Verify ownership
      const existingSession = await db.select()
        .from(workoutSessionsTable)
        .where(and(
          eq(workoutSessionsTable.id, sessionId),
          eq(workoutSessionsTable.userId, userId)
        ))
        .limit(1);

      if (existingSession.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Workout session not found'
        });
        return;
      }

      const [updatedSession] = await db.update(workoutSessionsTable)
        .set({
          ...updateData,
          updatedAt: new Date()
        })
        .where(eq(workoutSessionsTable.id, sessionId))
        .returning();

      logger.info(`User ${userId} updated workout session: ${sessionId}`);

      res.status(200).json({
        success: true,
        message: 'Workout session updated successfully',
        data: updatedSession
      });
    } catch (error) {
      logger.error('Error updating workout session:', error);
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

      // Verify ownership
      const existingSession = await db.select()
        .from(workoutSessionsTable)
        .where(and(
          eq(workoutSessionsTable.id, sessionId),
          eq(workoutSessionsTable.userId, userId)
        ))
        .limit(1);

      if (existingSession.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Workout session not found'
        });
        return;
      }

      const [completedSession] = await db.update(workoutSessionsTable)
        .set({
          completedAt: new Date(),
          notes: notes || existingSession[0].notes
        })
        .where(eq(workoutSessionsTable.id, sessionId))
        .returning();

      logger.info(`User ${userId} completed workout session: ${sessionId}`);

      res.status(200).json({
        success: true,
        message: 'Workout session completed successfully',
        data: completedSession
      });
    } catch (error) {
      logger.error('Error completing workout session:', error);
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

      // Verify ownership
      const existingSession = await db.select()
        .from(workoutSessionsTable)
        .where(and(
          eq(workoutSessionsTable.id, sessionId),
          eq(workoutSessionsTable.userId, userId)
        ))
        .limit(1);

      if (existingSession.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Workout session not found'
        });
        return;
      }

      await db.delete(workoutSessionsTable)
        .where(eq(workoutSessionsTable.id, sessionId));

      logger.info(`User ${userId} deleted workout session: ${sessionId}`);

      res.status(200).json({
        success: true,
        message: 'Workout session deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting workout session:', error);
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

      // Verify session ownership
      const session = await db.select()
        .from(workoutSessionsTable)
        .where(and(
          eq(workoutSessionsTable.id, workoutSessionId),
          eq(workoutSessionsTable.userId, userId)
        ))
        .limit(1);

      if (session.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Workout session not found'
        });
        return;
      }

      // Verify exercise exists
      const exercise = await db.select()
        .from(exercisesTable)
        .where(eq(exercisesTable.id, exerciseId))
        .limit(1);

      if (exercise.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Exercise not found'
        });
        return;
      }

      const [newWorkoutExercise] = await db.insert(workoutExercisesTable)
        .values({
          workoutSessionId,
          exerciseId,
          order,
          restTimeSeconds,
          notes
        })
        .returning();

      logger.info(`User ${userId} added exercise ${exerciseId} to workout session ${workoutSessionId}`);

      res.status(201).json({
        success: true,
        message: 'Exercise added to workout successfully',
        data: newWorkoutExercise
      });
    } catch (error) {
      logger.error('Error adding exercise to workout:', error);
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

      // Verify ownership through session
      const workoutExercise = await db.select({
        workoutExercise: workoutExercisesTable,
        session: workoutSessionsTable
      })
        .from(workoutExercisesTable)
        .innerJoin(workoutSessionsTable, eq(workoutExercisesTable.workoutSessionId, workoutSessionsTable.id))
        .where(and(
          eq(workoutExercisesTable.id, workoutExerciseId),
          eq(workoutSessionsTable.userId, userId)
        ))
        .limit(1);

      if (workoutExercise.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Workout exercise not found'
        });
        return;
      }

      const [updatedWorkoutExercise] = await db.update(workoutExercisesTable)
        .set(updateData)
        .where(eq(workoutExercisesTable.id, workoutExerciseId))
        .returning();

      logger.info(`User ${userId} updated workout exercise: ${workoutExerciseId}`);

      res.status(200).json({
        success: true,
        message: 'Workout exercise updated successfully',
        data: updatedWorkoutExercise
      });
    } catch (error) {
      logger.error('Error updating workout exercise:', error);
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

      // Verify ownership through session
      const workoutExercise = await db.select({
        workoutExercise: workoutExercisesTable,
        session: workoutSessionsTable
      })
        .from(workoutExercisesTable)
        .innerJoin(workoutSessionsTable, eq(workoutExercisesTable.workoutSessionId, workoutSessionsTable.id))
        .where(and(
          eq(workoutExercisesTable.id, workoutExerciseId),
          eq(workoutSessionsTable.userId, userId)
        ))
        .limit(1);

      if (workoutExercise.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Workout exercise not found'
        });
        return;
      }

      await db.delete(workoutExercisesTable)
        .where(eq(workoutExercisesTable.id, workoutExerciseId));

      logger.info(`User ${userId} removed exercise from workout: ${workoutExerciseId}`);

      res.status(200).json({
        success: true,
        message: 'Exercise removed from workout successfully'
      });
    } catch (error) {
      logger.error('Error removing exercise from workout:', error);
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

      // Verify ownership through session
      const workoutExercise = await db.select({
        workoutExercise: workoutExercisesTable,
        session: workoutSessionsTable
      })
        .from(workoutExercisesTable)
        .innerJoin(workoutSessionsTable, eq(workoutExercisesTable.workoutSessionId, workoutSessionsTable.id))
        .where(and(
          eq(workoutExercisesTable.id, workoutExerciseId),
          eq(workoutSessionsTable.userId, userId)
        ))
        .limit(1);

      if (workoutExercise.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Workout exercise not found'
        });
        return;
      }

      const [newSet] = await db.insert(exerciseSetsTable)
        .values({
          workoutExerciseId,
          setNumber,
          reps,
          weight,
          restTimeSeconds,
          notes
        })
        .returning();

      logger.info(`User ${userId} added set ${setNumber} to exercise ${workoutExerciseId}`);

      res.status(201).json({
        success: true,
        message: 'Set added successfully',
        data: newSet
      });
    } catch (error) {
      logger.error('Error adding set to exercise:', error);
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

      // Verify ownership through session
      const exerciseSet = await db.select({
        set: exerciseSetsTable,
        workoutExercise: workoutExercisesTable,
        session: workoutSessionsTable
      })
        .from(exerciseSetsTable)
        .innerJoin(workoutExercisesTable, eq(exerciseSetsTable.workoutExerciseId, workoutExercisesTable.id))
        .innerJoin(workoutSessionsTable, eq(workoutExercisesTable.workoutSessionId, workoutSessionsTable.id))
        .where(and(
          eq(exerciseSetsTable.id, setId),
          eq(workoutSessionsTable.userId, userId)
        ))
        .limit(1);

      if (exerciseSet.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Exercise set not found'
        });
        return;
      }

      const [updatedSet] = await db.update(exerciseSetsTable)
        .set(updateData)
        .where(eq(exerciseSetsTable.id, setId))
        .returning();

      logger.info(`User ${userId} updated exercise set: ${setId}`);

      res.status(200).json({
        success: true,
        message: 'Exercise set updated successfully',
        data: updatedSet
      });
    } catch (error) {
      logger.error('Error updating exercise set:', error);
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

      // Verify ownership through session
      const exerciseSet = await db.select({
        set: exerciseSetsTable,
        workoutExercise: workoutExercisesTable,
        session: workoutSessionsTable
      })
        .from(exerciseSetsTable)
        .innerJoin(workoutExercisesTable, eq(exerciseSetsTable.workoutExerciseId, workoutExercisesTable.id))
        .innerJoin(workoutSessionsTable, eq(workoutExercisesTable.workoutSessionId, workoutSessionsTable.id))
        .where(and(
          eq(exerciseSetsTable.id, setId),
          eq(workoutSessionsTable.userId, userId)
        ))
        .limit(1);

      if (exerciseSet.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Exercise set not found'
        });
        return;
      }

      await db.delete(exerciseSetsTable)
        .where(eq(exerciseSetsTable.id, setId));

      logger.info(`User ${userId} deleted exercise set: ${setId}`);

      res.status(200).json({
        success: true,
        message: 'Exercise set deleted successfully'
      });
    } catch (error) {
      logger.error('Error deleting exercise set:', error);
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
      const exercises = await db.select()
        .from(exercisesTable)
        .orderBy(asc(exercisesTable.name));

      logger.info(`User ${req.user!.id} retrieved exercise catalog`);

      res.status(200).json({
        success: true,
        message: 'Exercises retrieved successfully',
        data: exercises
      });
    } catch (error) {
      logger.error('Error retrieving exercises:', error);
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

      const exercise = await db.select()
        .from(exercisesTable)
        .where(eq(exercisesTable.id, exerciseId))
        .limit(1);

      if (exercise.length === 0) {
        res.status(404).json({
          success: false,
          message: 'Exercise not found'
        });
        return;
      }

      logger.info(`User ${req.user!.id} retrieved exercise: ${exerciseId}`);

      res.status(200).json({
        success: true,
        message: 'Exercise retrieved successfully',
        data: exercise[0]
      });
    } catch (error) {
      logger.error('Error retrieving exercise:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to retrieve exercise',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
} 