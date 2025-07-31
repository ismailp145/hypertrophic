import { UserModel } from '../models/user';

export interface CreateUserData {
  name: string;
  email: string;
  age: number;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  age?: number;
}

export const getAllUsers = async () => {
  const users = await UserModel.findAll();
  return users;
};

export const createUser = async (userData: CreateUserData) => {
  const { name, email, age } = userData;
  
  // Check if user already exists
  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const user = await UserModel.create({ name, email, age });
  return user;
};

export const getUserById = async (id: number) => {
  const user = await UserModel.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const updateUser = async (id: number, updateData: UpdateUserData) => {
  // Check if email is being updated and if it already exists
  if (updateData.email) {
    const existingUser = await UserModel.findByEmail(updateData.email);
    if (existingUser && existingUser.id !== id) {
      throw new Error('Email already exists');
    }
  }

  const user = await UserModel.update(id, updateData);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const deleteUser = async (id: number) => {
  const user = await UserModel.delete(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};