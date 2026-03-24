import { Router, Request, Response } from 'express';
import { z } from 'zod';

const router = Router();

// In-memory settings store
interface Settings {
  theme: 'dark' | 'light' | 'auto';
  notifications: boolean;
  refreshInterval: number;
}

let settings: Settings = {
  theme: 'dark',
  notifications: true,
  refreshInterval: 30000
};

// Body schema for updating settings
const updateSettingsSchema = z.object({
  theme: z.enum(['dark', 'light', 'auto']).optional(),
  notifications: z.boolean().optional(),
  refreshInterval: z.number().min(5000).max(300000).optional()
});

// GET /api/settings
router.get('/', (req: Request, res: Response) => {
  res.json(settings);
});

// PUT /api/settings
router.put('/', (req: Request, res: Response) => {
  const result = updateSettingsSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: result.error.flatten()
    });
  }

  // Update only the fields that were provided
  if (result.data.theme !== undefined) {
    settings.theme = result.data.theme;
  }
  if (result.data.notifications !== undefined) {
    settings.notifications = result.data.notifications;
  }
  if (result.data.refreshInterval !== undefined) {
    settings.refreshInterval = result.data.refreshInterval;
  }

  res.json(settings);
});

export default router;