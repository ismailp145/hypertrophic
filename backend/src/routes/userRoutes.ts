import express from 'express';
import * as userController from '../controllers/userController';

const router = express.Router();

router.get('/users', userController.getAllUsers);
router.post('/users', userController.createUser);
router.get('/users/:id', userController.getUserById);

export default router;