import {z} from 'zod';

// Get workout sessions by user validation schema
export const getWorkoutSessionsByUserSchema = z.object({
  query: z.object({
    limit: z.string().regex(/^\d+$/, 'Limit must be a number').transform(Number).optional(),
    offset: z.string().regex(/^\d+$/, 'Offset must be a number').transform(Number).optional(),
    completed: z.enum(['true', 'false']).transform(val => val === 'true').optional(),
  })
});

