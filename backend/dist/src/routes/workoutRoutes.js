var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import express from 'express';
import { validate } from '../middleware/validation';
import { createWorkoutSessionSchema, updateWorkoutSessionSchema, completeWorkoutSessionSchema, getWorkoutSessionByIdSchema, getWorkoutSessionsByUserSchema, deleteWorkoutSessionSchema, addExerciseToWorkoutSchema, updateWorkoutExerciseSchema, removeExerciseFromWorkoutSchema, addSetToExerciseSchema, updateExerciseSetSchema, deleteExerciseSetSchema } from '../validators/workoutValidators';
import { WorkoutController } from '../controllers/workoutController';
const router = express.Router();
const workoutController = new WorkoutController();
// All routes here are protected by auth middleware
// ===== WORKOUT SESSIONS =====
// Get all workout sessions for the authenticated user
router.get('/sessions', validate(getWorkoutSessionsByUserSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.getWorkoutSessions(req, res);
}));
// Get a single workout session by ID
router.get('/sessions/:id', validate(getWorkoutSessionByIdSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.getWorkoutSessionById(req, res);
}));
// Create a new workout session
router.post('/sessions', validate(createWorkoutSessionSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.createWorkoutSession(req, res);
}));
// Update a workout session
router.put('/sessions/:id', validate(updateWorkoutSessionSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.updateWorkoutSession(req, res);
}));
// Complete a workout session
router.patch('/sessions/:id/complete', validate(completeWorkoutSessionSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.completeWorkoutSession(req, res);
}));
// Delete a workout session
router.delete('/sessions/:id', validate(deleteWorkoutSessionSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.deleteWorkoutSession(req, res);
}));
// ===== EXERCISES IN WORKOUTS =====
// Add an exercise to a workout session
router.post('/sessions/:workoutSessionId/exercises', validate(addExerciseToWorkoutSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.addExerciseToWorkout(req, res);
}));
// Update an exercise in a workout
router.put('/exercises/:id', validate(updateWorkoutExerciseSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.updateWorkoutExercise(req, res);
}));
// Remove an exercise from a workout
router.delete('/exercises/:id', validate(removeExerciseFromWorkoutSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.removeExerciseFromWorkout(req, res);
}));
// ===== EXERCISE SETS =====
// Add a set to an exercise
router.post('/exercises/:workoutExerciseId/sets', validate(addSetToExerciseSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.addSetToExercise(req, res);
}));
// Update an exercise set
router.put('/sets/:id', validate(updateExerciseSetSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.updateExerciseSet(req, res);
}));
// Delete an exercise set
router.delete('/sets/:id', validate(deleteExerciseSetSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.deleteExerciseSet(req, res);
}));
// ===== EXERCISE CATALOG =====
// Get all available exercises (master catalog)
router.get('/exercises', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.getAllExercises(req, res);
}));
// Get exercise by ID
router.get('/exercises/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.getExerciseById(req, res);
}));
export default router;
