var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { UserModel } from '../models/user';
export const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield UserModel.findAll();
    return users;
});
//only called from authController.ts
export const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, age, password } = userData;
    // Check if user already exists
    const existingUser = yield UserModel.findByEmail(email);
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    const user = yield UserModel.create({
        name,
        email,
        age: age || null, // Allow null for optional age
        password: password || '' // Default to empty string if password is not provided
    });
    return user;
});
export const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModel.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
export const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModel.findByEmail(email);
    return user;
});
export const updateUser = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if email is being updated and if it already exists
    if (updateData.email) {
        const existingUser = yield UserModel.findByEmail(updateData.email);
        if (existingUser && existingUser.id !== id) {
            throw new Error('Email already exists');
        }
    }
    const user = yield UserModel.update(id, updateData);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
export const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield UserModel.delete(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
