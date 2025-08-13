// server.ts
import express from 'express';
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
const db = drizzle(process.env.DATABASE_URL);
dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;
// CORS configuration
const corsOptions = {
    origin: [
        'http://localhost:3000', // Web development
        'http://localhost:8081', // Expo web
        'http://localhost:19006', // Expo dev server
        'exp://localhost:19000', // Expo Go
        'exp://10.0.0.74:19000', // Expo Go with IP
        'http://10.0.0.74:8081', // Expo web with IP
        'exp://10.0.0.74:8081', // Expo go that worked
        process.env.FRONTEND_URL, // Custom frontend URL from env
    ].filter((url) => Boolean(url)), // Remove undefined values
    credentials: true,
    optionsSuccessStatus: 200,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
};
// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(loggingMiddleware);
// Rate limiting for all routes
app.use(rateLimiter);
// Public routes (no auth required)
app.get('/', (_req, res) => {
    res.send('Hypertrophic is running!');
});
app.get('/health', (_req, res) => {
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
app.use('*', (req, res) => {
    res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});
function loggingMiddleware(req, res, next) {
    console.log(`${new Date().toISOString()}: ${req.method} ${req.originalUrl}`);
    next();
}
// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
