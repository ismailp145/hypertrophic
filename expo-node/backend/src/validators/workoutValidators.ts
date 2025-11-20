import { z } from 'zod';

// Create workout session validation schema
export const createWorkoutSessionSchema = z.object({
  body: z.object({
    name: z.string()
      .min(1, 'Workout session name is required')
      .max(255, 'Workout session name must be less than 255 characters')
      .trim(),
    notes: z.string()
      .max(1000, 'Notes must be less than 1000 characters')
      .trim()
      .optional(),
  })
});

// Update workout session validation schema
export const updateWorkoutSessionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Workout session ID must be a number')
  }),
  body: z.object({
    name: z.string()
      .min(1, 'Workout session name is required')
      .max(255, 'Workout session name must be less than 255 characters')
      .trim()
      .optional(),
    notes: z.string()
      .max(1000, 'Notes must be less than 1000 characters')
      .trim()
      .optional(),
    completedAt: z.string()
      .datetime('Invalid datetime format')
      .transform((dateString) => new Date(dateString))
      .optional()
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
  })
});

// Complete workout session validation schema
export const completeWorkoutSessionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Workout session ID must be a number')
  }),
  body: z.object({
    notes: z.string()
      .max(1000, 'Notes must be less than 1000 characters')
      .trim()
      .optional(),
  })
});

// Add exercise to workout session validation schema
export const addExerciseToWorkoutSchema = z.object({
  params: z.object({
    workoutSessionId: z.string().regex(/^\d+$/, 'Workout session ID must be a number')
  }),
  body: z.object({
    exerciseId: z.number().int().positive('Exercise ID must be a positive integer'),
    order: z.number().int().positive('Order must be a positive integer'),
    restTimeSeconds: z.number()
      .int()
      .min(0, 'Rest time cannot be negative')
      .max(3600, 'Rest time cannot exceed 1 hour (3600 seconds)')
      .optional(),
    notes: z.string()
      .max(1000, 'Notes must be less than 1000 characters')
      .trim()
      .optional(),
  })
});

// Update workout exercise validation schema
export const updateWorkoutExerciseSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Workout exercise ID must be a number')
  }),
  body: z.object({
    order: z.number().int().positive('Order must be a positive integer').optional(),
    restTimeSeconds: z.number()
      .int()
      .min(0, 'Rest time cannot be negative')
      .max(3600, 'Rest time cannot exceed 1 hour (3600 seconds)')
      .optional(),
    notes: z.string()
      .max(1000, 'Notes must be less than 1000 characters')
      .trim()
      .optional(),
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
  })
});

// Add set to exercise validation schema
export const addSetToExerciseSchema = z.object({
  params: z.object({
    workoutExerciseId: z.string().regex(/^\d+$/, 'Workout exercise ID must be a number')
  }),
  body: z.object({
    setNumber: z.number().int().positive('Set number must be a positive integer'),
    reps: z.number().int().positive('Reps must be a positive integer'),
    weight: z.number()
      .positive('Weight must be positive')
      .max(9999.99, 'Weight cannot exceed 9999.99'),
    restTimeSeconds: z.number()
      .int()
      .min(0, 'Rest time cannot be negative')
      .max(3600, 'Rest time cannot exceed 1 hour (3600 seconds)')
      .optional(),
    notes: z.string()
      .max(1000, 'Notes must be less than 1000 characters')
      .trim()
      .optional(),
  })
});

// Update exercise set validation schema
export const updateExerciseSetSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Exercise set ID must be a number')
  }),
  body: z.object({
    reps: z.number().int().positive('Reps must be a positive integer').optional(),
    weight: z.number()
      .positive('Weight must be positive')
      .max(9999.99, 'Weight cannot exceed 9999.99')
      .optional(),
    restTimeSeconds: z.number()
      .int()
      .min(0, 'Rest time cannot be negative')
      .max(3600, 'Rest time cannot exceed 1 hour (3600 seconds)')
      .optional(),
    notes: z.string()
      .max(1000, 'Notes must be less than 1000 characters')
      .trim()
      .optional(),
    completedAt: z.string()
      .datetime('Invalid datetime format')
      .transform((dateString) => new Date(dateString))
      .optional()
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
  })
});

// Get workout session by ID validation schema
export const getWorkoutSessionByIdSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Workout session ID must be a number')
  })
});

// Get workout sessions by user validation schema
export const getWorkoutSessionsByUserSchema = z.object({
  query: z.object({
    limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).optional(),
    offset: z.string().regex(/^\d+$/, 'Offset must be a number').transform(Number).optional(),
    completed: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  })
});

// Delete workout session validation schema
export const deleteWorkoutSessionSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Workout session ID must be a number')
  })
});

// Remove exercise from workout validation schema
export const removeExerciseFromWorkoutSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Workout exercise ID must be a number')
  })
});

// Delete exercise set validation schema
export const deleteExerciseSetSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, 'Exercise set ID must be a number')
  })
});

// Type exports for use in controllers
export type CreateWorkoutSessionInput = z.infer<typeof createWorkoutSessionSchema>['body'];
export type UpdateWorkoutSessionInput = z.infer<typeof updateWorkoutSessionSchema>['body'];
export type CompleteWorkoutSessionInput = z.infer<typeof completeWorkoutSessionSchema>['body'];
export type AddExerciseToWorkoutInput = z.infer<typeof addExerciseToWorkoutSchema>['body'];
export type UpdateWorkoutExerciseInput = z.infer<typeof updateWorkoutExerciseSchema>['body'];
export type AddSetToExerciseInput = z.infer<typeof addSetToExerciseSchema>['body'];
export type UpdateExerciseSetInput = z.infer<typeof updateExerciseSetSchema>['body'];
export type WorkoutSessionParams = z.infer<typeof getWorkoutSessionByIdSchema>['params'];
export type WorkoutSessionsQuery = z.infer<typeof getWorkoutSessionsByUserSchema>['query']; 