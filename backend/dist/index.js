"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
require("dotenv/config");
const node_postgres_1 = require("drizzle-orm/node-postgres");
const userRoutes_1 = __importDefault(require("./src/routes/userRoutes"));
const workoutRoutes_1 = __importDefault(require("./src/routes/workoutRoutes"));
const authRoutes_1 = __importDefault(require("./src/routes/authRoutes"));
const auth_1 = __importDefault(require("./src/middleware/auth"));
const errorHandler_1 = require("./src/middleware/errorHandler");
const rateLimiter_1 = __importDefault(require("./src/middleware/rateLimiter"));
const db = (0, node_postgres_1.drizzle)(process.env.DATABASE_URL);
dotenv_1.default.config();
const app = (0, express_1.default)();
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
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(loggingMiddleware);
// Rate limiting for all routes
app.use(rateLimiter_1.default);
// Public routes (no auth required)
app.get('/', (_req, res) => {
    res.send('Hypertrophic is running!');
});
app.get('/health', (_req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
// Auth routes (public for login/register, protected for profile)
app.use('/api/auth', authRoutes_1.default);
// Protected routes (auth required)
app.use('/api/users', auth_1.default, userRoutes_1.default);
app.use('/api/workouts', auth_1.default, workoutRoutes_1.default);
// Error handling middleware (must be last)
app.use(errorHandler_1.errorHandler);
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
