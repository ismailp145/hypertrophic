import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { asyncHandler } from '../middleware/errorHandler';
import * as userService from '../services/userService';

// Register new user
export const register = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required'
    });
  }

  // Check if user already exists
  const existingUser = await userService.getUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: 'User with this email already exists'
    });
  }

  // Hash password
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // Create user
  const user = await userService.createUser({
    name,
    email,
    password: hashedPassword
  });

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      name: user.name 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

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
});

// Login user
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Find user by email
  const user = await userService.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email,
      name: user.name 
    },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

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
});

// Get current user profile
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  // The user data is already attached by the auth middleware
  const user = (req as any).user;

  res.json({
    success: true,
    user: {
      id: user.userId,
      name: user.name,
      email: user.email
    }
  });
}); 