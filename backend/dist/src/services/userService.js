"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUserByEmail = exports.getUserById = exports.createUser = exports.getAllUsers = void 0;
const user_1 = require("../models/user");
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield user_1.UserModel.findAll();
    return users;
});
exports.getAllUsers = getAllUsers;
//only called from authController.ts
const createUser = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, age, password } = userData;
    // Check if user already exists
    const existingUser = yield user_1.UserModel.findByEmail(email);
    if (existingUser) {
        throw new Error('User with this email already exists');
    }
    const user = yield user_1.UserModel.create({
        name,
        email,
        age: age || null, // Allow null for optional age
        password: password || '' // Default to empty string if password is not provided
    });
    return user;
});
exports.createUser = createUser;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.UserModel.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
exports.getUserById = getUserById;
const getUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.UserModel.findByEmail(email);
    return user;
});
exports.getUserByEmail = getUserByEmail;
const updateUser = (id, updateData) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if email is being updated and if it already exists
    if (updateData.email) {
        const existingUser = yield user_1.UserModel.findByEmail(updateData.email);
        if (existingUser && existingUser.id !== id) {
            throw new Error('Email already exists');
        }
    }
    const user = yield user_1.UserModel.update(id, updateData);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
exports.updateUser = updateUser;
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_1.UserModel.delete(id);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
});
exports.deleteUser = deleteUser;
