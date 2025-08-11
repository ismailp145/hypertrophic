"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
// Register user validation schema
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z.string()
            .min(2, 'Name must be at least 2 characters long')
            .max(50, 'Name must be less than 50 characters')
            .trim(),
        email: zod_1.z.string()
            .email('Invalid email format')
            .min(5, 'Email must be at least 5 characters')
            .max(100, 'Email must be less than 100 characters')
            .toLowerCase()
            .trim(),
        password: zod_1.z.string()
            .min(8, 'Password must be at least 8 characters long')
            .max(100, 'Password must be less than 100 characters')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number')
    })
});
// Login validation schema
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string()
            .email('Invalid email format')
            .toLowerCase()
            .trim(),
        password: zod_1.z.string()
            .min(1, 'Password is required')
    })
});
// Profile update validation schema
exports.updateProfileSchema = zod_1.z.object({
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
