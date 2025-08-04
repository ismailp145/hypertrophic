import express from 'express';
import * as userController from '../controllers/userController';
import { AuthenticatedRequest } from '../middleware/auth';

const router = express.Router();

// All routes here are now protected by auth middleware
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

export default router;