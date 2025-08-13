import { z } from 'zod';
// Get user by ID validation schema
export const getUserByIdSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'User ID must be a number')
    })
});
// Update user validation schema
export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'User ID must be a number')
    }),
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
// Delete user validation schema
export const deleteUserSchema = z.object({
    params: z.object({
        id: z.string().regex(/^\d+$/, 'User ID must be a number')
    })
});
