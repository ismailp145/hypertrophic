import { db } from '../config/database';
import { 
  workoutSessionsTable, 
  exercisesTable, 
  workoutExercisesTable, 
  exerciseSetsTable 
} from '../db/schema';
import { eq, and, desc, asc, isNull, isNotNull } from 'drizzle-orm';
import { logger } from '../utils/logger';

import {
  CreateWorkoutSessionData,
  UpdateWorkoutSessionData,
  AddExerciseToWorkoutData,
  UpdateWorkoutExerciseData,
  AddSetToExerciseData,
  UpdateExerciseSetData,
  WorkoutSessionWithExercises
} from '../types/Workout';
  