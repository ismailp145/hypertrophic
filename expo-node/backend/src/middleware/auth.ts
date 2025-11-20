// src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { asyncHandler } from './errorHandler';
import { Request, Response, NextFunction } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

const verifyToken = asyncHandler(async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false,
      message: 'Invalid token.' 
    });
  }
});

export default verifyToken;