// server.ts
import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import userRoutes from './src/routes/userRoutes';
import workoutRoutes from './src/routes/workoutRoutes';
import authRoutes from './src/routes/authRoutes';
import verifyToken from './src/middleware/auth';
import { errorHandler } from './src/middleware/errorHandler';
import rateLimiter from './src/middleware/rateLimiter';
const db = drizzle(process.env.DATABASE_URL!);

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(loggingMiddleware);

// Rate limiting for all routes
app.use(rateLimiter);

// Public routes (no auth required)
app.get('/', (_req: Request, res: Response) => {
  res.send('Hypertrophic is running!');
});

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Auth routes (public for login/register, protected for profile)
app.use('/api/auth', authRoutes);

// Protected routes (auth required)
app.use('/api/users', verifyToken, userRoutes);
app.use('/api/workouts', verifyToken, workoutRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler - catch all unmatched routes
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`${new Date().toISOString()}: ${req.method} ${req.originalUrl}`);
  next(); 
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
