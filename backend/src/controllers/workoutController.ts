import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import * as workoutService from '../services/workoutService';
import { 
  CreateWorkoutSessionData,
  UpdateWorkoutSessionData,
  AddExerciseToWorkoutData,
  UpdateWorkoutExerciseData,
  AddSetToExerciseData,
  UpdateExerciseSetData
} from '../types/Workout';

