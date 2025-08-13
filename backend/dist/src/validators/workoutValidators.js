"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteExerciseSetSchema = exports.removeExerciseFromWorkoutSchema = exports.deleteWorkoutSessionSchema = exports.getWorkoutSessionsByUserSchema = exports.getWorkoutSessionByIdSchema = exports.updateExerciseSetSchema = exports.addSetToExerciseSchema = exports.updateWorkoutExerciseSchema = exports.addExerciseToWorkoutSchema = exports.completeWorkoutSessionSchema = exports.updateWorkoutSessionSchema = exports.createWorkoutSessionSchema = void 0;
const zod_1 = require("zod");
// Create workout session validation schema
exports.createWorkoutSessionSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .min(1, 'Workout session name is required')
            .max(255, 'Workout session name must be less than 255 characters')
            .trim(),
        notes: zod_1.z.string()
            .max(1000, 'Notes must be less than 1000 characters')
            .trim()
            .optional(),
    })
});
// Update workout session validation schema
exports.updateWorkoutSessionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'Workout session ID must be a number')
    }),
    body: zod_1.z.object({
        name: zod_1.z.string()
            .min(1, 'Workout session name is required')
            .max(255, 'Workout session name must be less than 255 characters')
            .trim()
            .optional(),
        notes: zod_1.z.string()
            .max(1000, 'Notes must be less than 1000 characters')
            .trim()
            .optional(),
        completedAt: zod_1.z.string()
            .datetime('Invalid datetime format')
            .transform((dateString) => new Date(dateString))
            .optional()
    }).refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update'
    })
});
// Complete workout session validation schema
exports.completeWorkoutSessionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'Workout session ID must be a number')
    }),
    body: zod_1.z.object({
        notes: zod_1.z.string()
            .max(1000, 'Notes must be less than 1000 characters')
            .trim()
            .optional(),
    })
});
// Add exercise to workout session validation schema
exports.addExerciseToWorkoutSchema = zod_1.z.object({
    params: zod_1.z.object({
        workoutSessionId: zod_1.z.string().regex(/^\d+$/, 'Workout session ID must be a number')
    }),
    body: zod_1.z.object({
        exerciseId: zod_1.z.number().int().positive('Exercise ID must be a positive integer'),
        order: zod_1.z.number().int().positive('Order must be a positive integer'),
        restTimeSeconds: zod_1.z.number()
            .int()
            .min(0, 'Rest time cannot be negative')
            .max(3600, 'Rest time cannot exceed 1 hour (3600 seconds)')
            .optional(),
        notes: zod_1.z.string()
            .max(1000, 'Notes must be less than 1000 characters')
            .trim()
            .optional(),
    })
});
// Update workout exercise validation schema
exports.updateWorkoutExerciseSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'Workout exercise ID must be a number')
    }),
    body: zod_1.z.object({
        order: zod_1.z.number().int().positive('Order must be a positive integer').optional(),
        restTimeSeconds: zod_1.z.number()
            .int()
            .min(0, 'Rest time cannot be negative')
            .max(3600, 'Rest time cannot exceed 1 hour (3600 seconds)')
            .optional(),
        notes: zod_1.z.string()
            .max(1000, 'Notes must be less than 1000 characters')
            .trim()
            .optional(),
    }).refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update'
    })
});
// Add set to exercise validation schema
exports.addSetToExerciseSchema = zod_1.z.object({
    params: zod_1.z.object({
        workoutExerciseId: zod_1.z.string().regex(/^\d+$/, 'Workout exercise ID must be a number')
    }),
    body: zod_1.z.object({
        setNumber: zod_1.z.number().int().positive('Set number must be a positive integer'),
        reps: zod_1.z.number().int().positive('Reps must be a positive integer'),
        weight: zod_1.z.number()
            .positive('Weight must be positive')
            .max(9999.99, 'Weight cannot exceed 9999.99'),
        restTimeSeconds: zod_1.z.number()
            .int()
            .min(0, 'Rest time cannot be negative')
            .max(3600, 'Rest time cannot exceed 1 hour (3600 seconds)')
            .optional(),
        notes: zod_1.z.string()
            .max(1000, 'Notes must be less than 1000 characters')
            .trim()
            .optional(),
    })
});
// Update exercise set validation schema
exports.updateExerciseSetSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'Exercise set ID must be a number')
    }),
    body: zod_1.z.object({
        reps: zod_1.z.number().int().positive('Reps must be a positive integer').optional(),
        weight: zod_1.z.number()
            .positive('Weight must be positive')
            .max(9999.99, 'Weight cannot exceed 9999.99')
            .optional(),
        restTimeSeconds: zod_1.z.number()
            .int()
            .min(0, 'Rest time cannot be negative')
            .max(3600, 'Rest time cannot exceed 1 hour (3600 seconds)')
            .optional(),
        notes: zod_1.z.string()
            .max(1000, 'Notes must be less than 1000 characters')
            .trim()
            .optional(),
        completedAt: zod_1.z.string()
            .datetime('Invalid datetime format')
            .transform((dateString) => new Date(dateString))
            .optional()
    }).refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update'
    })
});
// Get workout session by ID validation schema
exports.getWorkoutSessionByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'Workout session ID must be a number')
    })
});
// Get workout sessions by user validation schema
exports.getWorkoutSessionsByUserSchema = zod_1.z.object({
    query: zod_1.z.object({
        limit: zod_1.z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).optional(),
        offset: zod_1.z.string().regex(/^\d+$/, 'Offset must be a number').transform(Number).optional(),
        completed: zod_1.z.enum(['true', 'false']).transform(val => val === 'true').optional(),
    })
});
// Delete workout session validation schema
exports.deleteWorkoutSessionSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'Workout session ID must be a number')
    })
});
// Remove exercise from workout validation schema
exports.removeExerciseFromWorkoutSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'Workout exercise ID must be a number')
    })
});
// Delete exercise set validation schema
exports.deleteExerciseSetSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'Exercise set ID must be a number')
    })
});
