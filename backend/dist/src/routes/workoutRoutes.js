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
const router = express_1.default.Router();
// All routes here are now protected by auth middleware
// Get all workouts
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        success: true,
        message: 'Get all workouts (placeholder)',
        user: req.user
    });
}));
// Get a single workout by ID
router.get('/:id', (0, validation_1.validate)(workoutValidators_1.getWorkoutByIdSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        success: true,
        message: `Get workout ${req.params.id} (placeholder)`,
        user: req.user
    });
}));
// Create a new workout
router.post('/', (0, validation_1.validate)(workoutValidators_1.createWorkoutSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(201).json({
        success: true,
        message: 'Create workout (placeholder)',
        user: req.user
    });
}));
// Update a workout by ID
router.put('/:id', (0, validation_1.validate)(workoutValidators_1.updateWorkoutSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        success: true,
        message: `Update workout ${req.params.id} (placeholder)`,
        user: req.user
    });
}));
// Delete a workout by ID
router.delete('/:id', (0, validation_1.validate)(workoutValidators_1.deleteWorkoutSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json({
        success: true,
        message: `Delete workout ${req.params.id} (placeholder)`,
        user: req.user
    });
}));
exports.default = router;
