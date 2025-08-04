import express from 'express';
import * as authController from '../controllers/authController';
import verifyToken from '../middleware/auth';

const router = express.Router();

// Public routes (no auth required)
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes (auth required)
router.get('/profile', verifyToken, authController.getProfile);

export default router; 