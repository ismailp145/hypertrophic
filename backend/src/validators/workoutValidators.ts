import { z } from 'zod';

// Create workout validation schema
export const createWorkoutSchema = z.object({
  body: z.object({
    name: z.string()
      .min(1, 'Workout name is required')
      .max(100, 'Workout name must be less than 100 characters')
      .trim(),
    duration: z.number()
      .min(1, 'Duration must be at least 1 minute')
      .max(480, 'Duration cannot exceed 8 hours (480 minutes)')
      .optional(),
    type: z.enum(['strength', 'cardio', 'flexibility', 'sports', 'other']).optional(),
    description: z.string()
      .max(500, 'Description must be less than 500 characters')
      .trim()
      .optional(),
    date: z.iso.datetime('Invalid ISO datetime format')
    .transform((dateString) => new Date(dateString))
    .optional()
  })
});

// Update workout validation schema
export const updateWorkoutSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Workout ID must be a number')
  }),
  body: z.object({
    name: z.string()
      .min(1, 'Workout name is required')
      .max(100, 'Workout name must be less than 100 characters')
      .trim()
      .optional(),
    duration: z.number()
      .min(1, 'Duration must be at least 1 minute')
      .max(480, 'Duration cannot exceed 8 hours (480 minutes)')
      .optional(),
    type: z.enum(['strength', 'cardio', 'flexibility', 'sports', 'other']).optional(),
    description: z.string()
      .max(500, 'Description must be less than 500 characters')
      .trim()
      .optional(),
    date: z.iso.datetime('Invalid ISO datetime format')
    .transform((dateString) => new Date(dateString))
    .optional()
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
  })
});

// Get workout by ID validation schema
export const getWorkoutByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Workout ID must be a number')
  })
});

// Delete workout validation schema
export const deleteWorkoutSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Workout ID must be a number')
  })
});

// Type exports for use in controllers
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>['body'];
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>['body'];
export type WorkoutParams = z.infer<typeof getWorkoutByIdSchema>['params']; 