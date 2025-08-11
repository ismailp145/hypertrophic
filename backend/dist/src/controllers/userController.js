"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.deleteUser = exports.updateUser = exports.getUserById = exports.getAllUsers = void 0;
const userService = __importStar(require("../services/userService"));
// TODO: usually services take in objects which just the data they need
// and then return a response object with the data the app needs, if you use DTOs
// like this you can prevent things like leaking data to the client ex passwords, other protected data
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userService.getAllUsers();
        res.json({
            success: true,
            users
        });
    }
    catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch users'
        });
    }
});
exports.getAllUsers = getAllUsers;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID'
            });
        }
        const user = yield userService.getUserById(userId);
        res.json({
            success: true,
            user
        });
    }
    catch (error) {
        console.error('Error fetching user:', error);
        if (error instanceof Error && error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            error: 'Failed to fetch user'
        });
    }
});
exports.getUserById = getUserById;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID'
            });
        }
        const { name, email, age } = req.body;
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (email !== undefined)
            updateData.email = email;
        if (age !== undefined)
            updateData.age = age;
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No valid fields to update'
            });
        }
        const user = yield userService.updateUser(userId, updateData);
        res.json({
            success: true,
            user
        });
    }
    catch (error) {
        console.error('Error updating user:', error);
        if (error instanceof Error && error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }
        if (error instanceof Error && error.message === 'Email already exists') {
            return res.status(409).json({
                success: false,
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            error: 'Failed to update user'
        });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid user ID'
            });
        }
        yield userService.deleteUser(userId);
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        if (error instanceof Error && error.message === 'User not found') {
            return res.status(404).json({
                success: false,
                error: error.message
            });
        }
        res.status(500).json({
            success: false,
            error: 'Failed to delete user'
        });
    }
});
exports.deleteUser = deleteUser;
