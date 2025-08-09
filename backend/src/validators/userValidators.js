"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserSchema = exports.updateUserSchema = exports.getUserByIdSchema = void 0;
const zod_1 = require("zod");
// Get user by ID validation schema
exports.getUserByIdSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'User ID must be a number')
    })
});
// Update user validation schema
exports.updateUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'User ID must be a number')
    }),
    body: zod_1.z.object({
        name: zod_1.z.string()
            .min(2, 'Name must be at least 2 characters long')
            .max(50, 'Name must be less than 50 characters')
            .trim()
            .optional(),
        email: zod_1.z.string()
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
exports.deleteUserSchema = zod_1.z.object({
    params: zod_1.z.object({
        id: zod_1.z.string().regex(/^\d+$/, 'User ID must be a number')
    })
});
