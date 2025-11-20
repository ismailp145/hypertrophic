import express, { Response, Router } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { validate } from '../middleware/validation';
import { 
  createWorkoutSessionSchema,
  updateWorkoutSessionSchema,
  completeWorkoutSessionSchema,
  getWorkoutSessionByIdSchema,
  getWorkoutSessionsByUserSchema,
  deleteWorkoutSessionSchema,
  addExerciseToWorkoutSchema,
  updateWorkoutExerciseSchema,
  removeExerciseFromWorkoutSchema,
  addSetToExerciseSchema,
  updateExerciseSetSchema,
  deleteExerciseSetSchema
} from '../validators/workoutValidators';
import { WorkoutController } from '../controllers/workoutController';

const router: Router = express.Router();
const workoutController = new WorkoutController();

// All routes here are protected by auth middleware

// ===== WORKOUT SESSIONS =====

// Get all workout sessions for the authenticated user
router.get('/sessions', validate(getWorkoutSessionsByUserSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await workoutController.getWorkoutSessions(req, res);
});

// Get a single workout session by ID
router.get('/sessions/:id', validate(getWorkoutSessionByIdSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await workoutController.getWorkoutSessionById(req, res);
});

// Create a new workout session
router.post('/sessions', validate(createWorkoutSessionSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await workoutController.createWorkoutSession(req, res);
});

// Update a workout session
router.put('/sessions/:id', validate(updateWorkoutSessionSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await workoutController.updateWorkoutSession(req, res);
});

// Complete a workout session
router.patch('/sessions/:id/complete', validate(completeWorkoutSessionSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await workoutController.completeWorkoutSession(req, res);
});

// Delete a workout session
router.delete('/sessions/:id', validate(deleteWorkoutSessionSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await workoutController.deleteWorkoutSession(req, res);
});

// ===== EXERCISES IN WORKOUTS =====

// Add an exercise to a workout session
router.post('/sessions/:workoutSessionId/exercises', validate(addExerciseToWorkoutSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await workoutController.addExerciseToWorkout(req, res);
});

// Update an exercise in a workout
router.put('/exercises/:id', validate(updateWorkoutExerciseSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await workoutController.updateWorkoutExercise(req, res);
});

// Remove an exercise from a workout
router.delete('/exercises/:id', validate(removeExerciseFromWorkoutSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await workoutController.removeExerciseFromWorkout(req, res);
});

// ===== EXERCISE SETS =====

// Add a set to an exercise
router.post('/exercises/:workoutExerciseId/sets', validate(addSetToExerciseSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await workoutController.addSetToExercise(req, res);
});

// Update an exercise set
router.put('/sets/:id', validate(updateExerciseSetSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await workoutController.updateExerciseSet(req, res);
});

// Delete an exercise set
router.delete('/sets/:id', validate(deleteExerciseSetSchema), async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await workoutController.deleteExerciseSet(req, res);
});

// ===== EXERCISE CATALOG =====

// Get all available exercises (master catalog)
router.get('/exercises', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await workoutController.getAllExercises(req, res);
});

// Get exercise by ID
router.get('/exercises/:id', async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  await workoutController.getExerciseById(req, res);
});

export default router;