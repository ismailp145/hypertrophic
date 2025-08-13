import { db } from '../config/database';
import { 
  workoutSessionsTable, 
  exercisesTable, 
  workoutExercisesTable, 
  exerciseSetsTable 
} from '../db/schema';
import { eq, and, desc, asc, isNull, isNotNull } from 'drizzle-orm';
import { logger } from '../utils/logger';

export interface CreateWorkoutSessionData {
  userId: number;
  name: string;
  notes?: string;
}

export interface UpdateWorkoutSessionData {
  name?: string;
  notes?: string;
}

export interface AddExerciseToWorkoutData {
  workoutSessionId: number;
  exerciseId: number;
  order: number;
  restTimeSeconds?: number;
  notes?: string;
}

export interface UpdateWorkoutExerciseData {
  order?: number;
  restTimeSeconds?: number;
  notes?: string;
}

export interface AddSetToExerciseData {
  workoutExerciseId: number;
  setNumber: number;
  reps: number;
  weight: string;
  restTimeSeconds?: number;
  notes?: string;
}

export interface UpdateExerciseSetData {
  setNumber?: number;
  reps?: number;
  weight?: string;
  restTimeSeconds?: number;
  notes?: string;
}

export interface WorkoutSessionWithExercises {
  id: number;
  userId: number;
  name: string;
  startedAt: Date;
  completedAt: Date | null;
  notes: string | null;
  createdAt: Date;
  exercises: Array<{
    id: number;
    workoutSessionId: number;
    exerciseId: number;
    order: number;
    restTimeSeconds: number | null;
    notes: string | null;
    createdAt: Date;
    sets: Array<{
      id: number;
      workoutExerciseId: number;
      setNumber: number;
      reps: number;
      weight: string;
      restTimeSeconds: number | null;
      completedAt: Date | null;
      notes: string | null;
      createdAt: Date;
    }>;
  }>;
}

// ===== WORKOUT SESSIONS =====

export const createWorkoutSession = async (data: CreateWorkoutSessionData) => {
  const { userId, name, notes } = data;
  
  const [newSession] = await db.insert(workoutSessionsTable)
    .values({
      userId,
      name,
      notes,
      startedAt: new Date(),
    })
    .returning();

  logger.info(`User ${userId} created workout session: ${newSession.id}`);
  return newSession;
};

export const getWorkoutSessions = async (userId: number, limit: number = 10, offset: number = 0, completed?: boolean) => {
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
    .limit(limit)
    .offset(offset);

  logger.info(`User ${userId} retrieved ${sessions.length} workout sessions`);
  return sessions;
};

export const getWorkoutSessionById = async (userId: number, sessionId: number): Promise<WorkoutSessionWithExercises> => {
  const session = await db.select()
    .from(workoutSessionsTable)
    .where(and(
      eq(workoutSessionsTable.id, sessionId),
      eq(workoutSessionsTable.userId, userId)
    ))
    .limit(1);

  if (session.length === 0) {
    throw new Error('Workout session not found');
  }

  // Get exercises for this session
  const exercises = await db.select()
    .from(workoutExercisesTable)
    .where(eq(workoutExercisesTable.workoutSessionId, sessionId))
    .orderBy(asc(workoutExercisesTable.order));

  // Get sets for each exercise
  const sessionWithExercises: WorkoutSessionWithExercises = {
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
  return sessionWithExercises;
};

export const updateWorkoutSession = async (userId: number, sessionId: number, updateData: UpdateWorkoutSessionData) => {
  // Verify ownership
  const existingSession = await db.select()
    .from(workoutSessionsTable)
    .where(and(
      eq(workoutSessionsTable.id, sessionId),
      eq(workoutSessionsTable.userId, userId)
    ))
    .limit(1);

  if (existingSession.length === 0) {
    throw new Error('Workout session not found');
  }

  const [updatedSession] = await db.update(workoutSessionsTable)
    .set(updateData)
    .where(eq(workoutSessionsTable.id, sessionId))
    .returning();

  logger.info(`User ${userId} updated workout session: ${sessionId}`);
  return updatedSession;
};

export const completeWorkoutSession = async (userId: number, sessionId: number, notes?: string) => {
  // Verify ownership
  const existingSession = await db.select()
    .from(workoutSessionsTable)
    .where(and(
      eq(workoutSessionsTable.id, sessionId),
      eq(workoutSessionsTable.userId, userId)
    ))
    .limit(1);

  if (existingSession.length === 0) {
    throw new Error('Workout session not found');
  }

  const [completedSession] = await db.update(workoutSessionsTable)
    .set({
      completedAt: new Date(),
      notes: notes || existingSession[0].notes
    })
    .where(eq(workoutSessionsTable.id, sessionId))
    .returning();

  logger.info(`User ${userId} completed workout session: ${sessionId}`);
  return completedSession;
};

export const deleteWorkoutSession = async (userId: number, sessionId: number) => {
  // Verify ownership
  const existingSession = await db.select()
    .from(workoutSessionsTable)
    .where(and(
      eq(workoutSessionsTable.id, sessionId),
      eq(workoutSessionsTable.userId, userId)
    ))
    .limit(1);

  if (existingSession.length === 0) {
    throw new Error('Workout session not found');
  }

  await db.delete(workoutSessionsTable)
    .where(eq(workoutSessionsTable.id, sessionId));

  logger.info(`User ${userId} deleted workout session: ${sessionId}`);
  return { success: true };
};

// ===== EXERCISES IN WORKOUTS =====

export const addExerciseToWorkout = async (userId: number, data: AddExerciseToWorkoutData) => {
  const { workoutSessionId, exerciseId, order, restTimeSeconds, notes } = data;

  // Verify session ownership
  const session = await db.select()
    .from(workoutSessionsTable)
    .where(and(
      eq(workoutSessionsTable.id, workoutSessionId),
      eq(workoutSessionsTable.userId, userId)
    ))
    .limit(1);

  if (session.length === 0) {
    throw new Error('Workout session not found');
  }

  // Verify exercise exists
  const exercise = await db.select()
    .from(exercisesTable)
    .where(eq(exercisesTable.id, exerciseId))
    .limit(1);

  if (exercise.length === 0) {
    throw new Error('Exercise not found');
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
  return newWorkoutExercise;
};

export const updateWorkoutExercise = async (userId: number, workoutExerciseId: number, updateData: UpdateWorkoutExerciseData) => {
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
    throw new Error('Workout exercise not found');
  }

  const [updatedWorkoutExercise] = await db.update(workoutExercisesTable)
    .set(updateData)
    .where(eq(workoutExercisesTable.id, workoutExerciseId))
    .returning();

  logger.info(`User ${userId} updated workout exercise: ${workoutExerciseId}`);
  return updatedWorkoutExercise;
};

export const removeExerciseFromWorkout = async (userId: number, workoutExerciseId: number) => {
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
    throw new Error('Workout exercise not found');
  }

  await db.delete(workoutExercisesTable)
    .where(eq(workoutExercisesTable.id, workoutExerciseId));

  logger.info(`User ${userId} removed exercise from workout: ${workoutExerciseId}`);
  return { success: true };
};

// ===== EXERCISE SETS =====

export const addSetToExercise = async (userId: number, workoutExerciseId: number, data: AddSetToExerciseData) => {
  const { setNumber, reps, weight, restTimeSeconds, notes } = data;

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
    throw new Error('Workout exercise not found');
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
  return newSet;
};

export const updateExerciseSet = async (userId: number, setId: number, updateData: UpdateExerciseSetData) => {
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
    throw new Error('Exercise set not found');
  }

  const [updatedSet] = await db.update(exerciseSetsTable)
    .set(updateData)
    .where(eq(exerciseSetsTable.id, setId))
    .returning();

  logger.info(`User ${userId} updated exercise set: ${setId}`);
  return updatedSet;
};

export const deleteExerciseSet = async (userId: number, setId: number) => {
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
    throw new Error('Exercise set not found');
  }

  await db.delete(exerciseSetsTable)
    .where(eq(exerciseSetsTable.id, setId));

  logger.info(`User ${userId} deleted exercise set: ${setId}`);
  return { success: true };
};

// ===== EXERCISE CATALOG =====

export const getAllExercises = async () => {
  const exercises = await db.select()
    .from(exercisesTable)
    .orderBy(asc(exercisesTable.name));

  return exercises;
};

export const getExerciseById = async (exerciseId: number) => {
  const exercise = await db.select()
    .from(exercisesTable)
    .where(eq(exercisesTable.id, exerciseId))
    .limit(1);

  if (exercise.length === 0) {
    throw new Error('Exercise not found');
  }

  return exercise[0];
};
