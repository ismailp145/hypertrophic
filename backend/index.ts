// server.ts
import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import userRoutes from './src/routes/userRoutes';
import workoutRoutes from './src/routes/workoutRoutes';
const db = drizzle(process.env.DATABASE_URL!);


dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;


// Middleware
app.use(cors());
app.use(express.json());
app.use(loggingMiddleware)
// Routes
app.use('/api', userRoutes);
app.use('/api', workoutRoutes);

// Root health‐check
app.get('/', (_req: Request, res: Response) => {
  res.send('Hypertrophic is running!');
});

function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(`${new Date().toISOString()}: ${req.originalUrl}`)
  next(); 
  return;
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
