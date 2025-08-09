import { z } from 'zod';

// Register user validation schema
export const registerSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must be less than 50 characters')
      .trim(),
    email: z.string()
      .email('Invalid email format')
      .min(5, 'Email must be at least 5 characters')
      .max(100, 'Email must be less than 100 characters')
      .toLowerCase()
      .trim(),
    password: z.string()
      .min(8, 'Password must be at least 8 characters long')
      .max(100, 'Password must be less than 100 characters')
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
  })
});

// Login validation schema
export const loginSchema = z.object({
  body: z.object({
    email: z.string()
      .email('Invalid email format')
      .toLowerCase()
      .trim(),
    password: z.string()
      .min(1, 'Password is required')
  })
});

// Profile update validation schema
export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, 'Name must be at least 2 characters long')
      .max(50, 'Name must be less than 50 characters')
      .trim()
      .optional(),
    email: z.string()
      .email('Invalid email format')
      .min(5, 'Email must be at least 5 characters')
      .max(100, 'Email must be less than 100 characters')
      .toLowerCase()
      .trim()
      .optional()
  }).refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update'
  })
});

// Type exports for use in controllers
export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>['body']; 