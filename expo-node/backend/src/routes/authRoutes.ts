import express from 'express';
import * as authController from '../controllers/authController';
import verifyToken from '../middleware/auth';
import { validate } from '../middleware/validation';
import { registerSchema, loginSchema } from '../validators/authValidators';

const router = express.Router();

// Public routes (no auth required)
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);

// Protected routes (auth required)
router.get('/profile', verifyToken, authController.getProfile);

export default router; 