"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validation_1 = require("../middleware/validation");
const workoutValidators_1 = require("../validators/workoutValidators");
const workoutController_1 = require("../controllers/workoutController");
const router = express_1.default.Router();
const workoutController = new workoutController_1.WorkoutController();
// All routes here are protected by auth middleware
// ===== WORKOUT SESSIONS =====
// Get all workout sessions for the authenticated user
router.get('/sessions', (0, validation_1.validate)(workoutValidators_1.getWorkoutSessionsByUserSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.getWorkoutSessions(req, res);
}));
// Get a single workout session by ID
router.get('/sessions/:id', (0, validation_1.validate)(workoutValidators_1.getWorkoutSessionByIdSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.getWorkoutSessionById(req, res);
}));
// Create a new workout session
router.post('/sessions', (0, validation_1.validate)(workoutValidators_1.createWorkoutSessionSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.createWorkoutSession(req, res);
}));
// Update a workout session
router.put('/sessions/:id', (0, validation_1.validate)(workoutValidators_1.updateWorkoutSessionSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.updateWorkoutSession(req, res);
}));
// Complete a workout session
router.patch('/sessions/:id/complete', (0, validation_1.validate)(workoutValidators_1.completeWorkoutSessionSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.completeWorkoutSession(req, res);
}));
// Delete a workout session
router.delete('/sessions/:id', (0, validation_1.validate)(workoutValidators_1.deleteWorkoutSessionSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.deleteWorkoutSession(req, res);
}));
// ===== EXERCISES IN WORKOUTS =====
// Add an exercise to a workout session
router.post('/sessions/:workoutSessionId/exercises', (0, validation_1.validate)(workoutValidators_1.addExerciseToWorkoutSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.addExerciseToWorkout(req, res);
}));
// Update an exercise in a workout
router.put('/exercises/:id', (0, validation_1.validate)(workoutValidators_1.updateWorkoutExerciseSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.updateWorkoutExercise(req, res);
}));
// Remove an exercise from a workout
router.delete('/exercises/:id', (0, validation_1.validate)(workoutValidators_1.removeExerciseFromWorkoutSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.removeExerciseFromWorkout(req, res);
}));
// ===== EXERCISE SETS =====
// Add a set to an exercise
router.post('/exercises/:workoutExerciseId/sets', (0, validation_1.validate)(workoutValidators_1.addSetToExerciseSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.addSetToExercise(req, res);
}));
// Update an exercise set
router.put('/sets/:id', (0, validation_1.validate)(workoutValidators_1.updateExerciseSetSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield workoutController.updateExerciseSet(req, res);
}));
// Delete an exercise set
router.delete('/sets/:id', (0, validation_1.validate)(workoutValidators_1.deleteExerciseSetSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.default = router;
