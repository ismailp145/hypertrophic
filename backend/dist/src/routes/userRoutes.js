import express from 'express';
import * as userController from '../controllers/userController';
import { validate } from '../middleware/validation';
import { getUserByIdSchema, updateUserSchema, deleteUserSchema } from '../validators/userValidators';
const router = express.Router();
// All routes here are now protected by auth middleware
router.get('/', userController.getAllUsers);
router.get('/:id', validate(getUserByIdSchema), userController.getUserById);
router.put('/:id', validate(updateUserSchema), userController.updateUser);
router.delete('/:id', validate(deleteUserSchema), userController.deleteUser);
export default router;
