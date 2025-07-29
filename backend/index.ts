// server.ts
import express, { Express, Request, Response } from 'express';
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

// Routes
app.use('/api/v1', userRoutes);
app.use('/api/v1', workoutRoutes);

// Root health‐check
app.get('/', (_req: Request, res: Response) => {
  res.send('Hypertrophic is running!');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
