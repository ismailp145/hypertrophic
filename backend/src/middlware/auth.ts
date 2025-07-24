// src/middleware/auth.js
import jwt from 'jsonwebtoken';
import { asyncHandler } from './errorHandler';
import { Request, Response, NextFunction } from 'express';

const verifyToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
});

module.exports = { verifyToken };
