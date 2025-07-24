import express, { Request, Response, Router } from 'express';


const router: Router = express.Router();

router.get('/', async (req: Request, res: Response): Promise<void> => {
  res.status(500).json({ error: 'Failed to retrieve users' });
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  res.status(500).json({ error: 'Failed to create user' });
});

router.post('/', async (req: Request, res: Response): Promise<void> => {
  res.status(500).json({ error: 'Failed to create user' });
});

export default router;
