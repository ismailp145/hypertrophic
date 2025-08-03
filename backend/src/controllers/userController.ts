import { Request, Response } from "express";
import * as userService from "../services/userService";

// TODO: usually services take in objects which just the data they need
// and then return a response object with the data the app needs, if you use DTOs
// like this you can prevent things like leaking data to the client ex passwords, other protected data
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
