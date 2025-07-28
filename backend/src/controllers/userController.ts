import { Request, Response } from 'express';
import * as userService from '../services/userService';

export const getAllUsers = async (req: Request, res: Response) => {
  await userService.getAllUsers(req, res);
};

export const createUser = async (req: Request, res: Response) => {
  await userService.createUser(req, res);
};

export const getUserById = async (req: Request, res: Response) => {
  await userService.getUserById(req, res);
};

export const updateUser = async (req: Request, res: Response) => {
  await userService.updateUser(req, res);
};

export const deleteUser = async (req: Request, res: Response) => {
  await userService.deleteUser(req, res);
};

