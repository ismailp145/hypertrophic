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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const errorHandler_1 = require("../middleware/errorHandler");
const userService = __importStar(require("../services/userService"));
// Register new user
exports.register = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    // Zod validation is handled by middleware, so we can trust the data here
    // Check if user already exists
    const existingUser = yield userService.getUserByEmail(email);
    if (existingUser) {
        return res.status(409).json({
            success: false,
            message: 'User with this email already exists'
        });
    }
    // Hash password with bcrypt, update to 12 in prod
    const saltRounds = 10;
    const hashedPassword = yield bcrypt_1.default.hash(password, saltRounds);
    // Create user
    const user = yield userService.createUser({
        name,
        email,
        password: hashedPassword
    });
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        name: user.name
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
}));
// Login user
exports.login = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Zod validation is handled by middleware, so we can trust the data here
    // Find user by email
    const user = yield userService.getUserByEmail(email);
    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
    // Check password
    const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
        });
    }
    // Generate JWT token
    const token = jsonwebtoken_1.default.sign({
        userId: user.id,
        email: user.email,
        name: user.name
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({
        success: true,
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email
        }
    });
}));
// Get current user profile
exports.getProfile = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Access denied. No token provided.'
        });
    }
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not set');
    }
    try {
        // Verify the JWT token
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        // Convert userId to number and get user data from database to ensure it's still valid
        const userId = parseInt(decoded.userId, 10);
        if (isNaN(userId)) {
            return res.status(401).json({
                success: false,
                message: 'Invalid user ID in token.'
            });
        }
        const user = yield userService.getUserById(userId);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found.'
            });
        }
        res.json({
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });
    }
    catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token.'
        });
    }
}));
