"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteWorkoutSchema = exports.getWorkoutByIdSchema = exports.updateWorkoutSchema = exports.createWorkoutSchema = void 0;
const zod_1 = require("zod");
// Create workout validation schema
exports.createWorkoutSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .min(1, 'Workout name is required')
            .max(100, 'Workout name must be less than 100 characters')
            .trim(),
        duration: zod_1.z.number()
            .min(1, 'Duration must be at least 1 minute')
            .max(480, 'Duration cannot exceed 8 hours (480 minutes)')
            .optional(),
        type: zod_1.z.enum(['strength', 'cardio', 'flexibility', 'sports', 'other']).optional(),
        description: zod_1.z.string()
            .max(500, 'Description must be less than 500 characters')
            .trim()
            .optional(),
        date: zod_1.z.string()
            .datetime('Invalid date format')
            .optional()
            .or(zod_1.z.date().optional())
    })
});
// Update workout validation schema
exports.updateWorkoutSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'Workout ID must be a number')
    }),
    body: zod_1.z.object({
        name: zod_1.z.string()
            .min(1, 'Workout name is required')
            .max(100, 'Workout name must be less than 100 characters')
            .trim()
            .optional(),
        duration: zod_1.z.number()
            .min(1, 'Duration must be at least 1 minute')
            .max(480, 'Duration cannot exceed 8 hours (480 minutes)')
            .optional(),
        type: zod_1.z.enum(['strength', 'cardio', 'flexibility', 'sports', 'other']).optional(),
        description: zod_1.z.string()
            .max(500, 'Description must be less than 500 characters')
            .trim()
            .optional(),
        date: zod_1.z.string()
            .datetime('Invalid date format')
            .optional()
            .or(zod_1.z.date().optional())
    }).refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field must be provided for update'
    })
});
// Get workout by ID validation schema
exports.getWorkoutByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'Workout ID must be a number')
    })
});
// Delete workout validation schema
exports.deleteWorkoutSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'Workout ID must be a number')
    })
});
