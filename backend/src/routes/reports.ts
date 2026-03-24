import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { generateOrders, generateCustomers } from '../services/dataGenerator';
import { validateQuery } from '../middleware/validator';

const router = Router();

// Helper to get default dates
function getDefaultStartDate(): string {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString().split('T')[0];
}

function getDefaultEndDate(): string {
  return new Date().toISOString().split('T')[0];
}

// Query schema for orders
const ordersQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD').optional(),
  page: z.string().regex(/^\d+$/, 'Page must be a number').optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional().transform(val => val ? parseInt(val, 10) : 50),
  sortBy: z.enum(['createdAt', 'amount', 'status', 'region', 'category']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  region: z.string().optional(),
  category: z.string().optional()
});

// Query schema for customers
const customersQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD').optional(),
  page: z.string().regex(/^\d+$/, 'Page must be a number').optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional().transform(val => val ? parseInt(val, 10) : 50)
});

// GET /api/reports/orders
router.get('/orders', validateQuery(ordersQuerySchema), (req: Request, res: Response) => {
  const startDate = req.query.startDate as string || getDefaultStartDate();
  const endDate = req.query.endDate as string || getDefaultEndDate();
  const page = typeof req.query.page === 'number' ? req.query.page : 1;
  const limit = typeof req.query.limit === 'number' ? req.query.limit : 50;

  const data = generateOrders(startDate, endDate, page, limit);

  // Apply filtering if provided
  let orders = data.orders;
  const region = req.query.region as string;
  const category = req.query.category as string;

  if (region) {
    orders = orders.filter(o => o.region === region);
  }
  if (category) {
    orders = orders.filter(o => o.category === category);
  }

  // Apply sorting
  const sortBy = req.query.sortBy as string;
  const sortOrder = req.query.sortOrder as string || 'desc';

  if (sortBy) {
    orders.sort((a: any, b: any) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
  }

  res.json({
    orders,
    total: data.total,
    page,
    limit
  });
});

// GET /api/reports/customers
router.get('/customers', validateQuery(customersQuerySchema), (req: Request, res: Response) => {
  const startDate = req.query.startDate as string || getDefaultStartDate();
  const endDate = req.query.endDate as string || getDefaultEndDate();
  const page = typeof req.query.page === 'number' ? req.query.page : 1;
  const limit = typeof req.query.limit === 'number' ? req.query.limit : 50;

  const data = generateCustomers(startDate, endDate, page, limit);

  res.json({
    customers: data.customers,
    total: data.total
  });
});

export default router;