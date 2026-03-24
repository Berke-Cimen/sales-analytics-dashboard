import { z } from 'zod';

// Date range and granularity query schema
export const dateRangeQuerySchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD').optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD').optional(),
  granularity: z.enum(['day', 'week', 'month', 'quarter', 'year']).optional(),
  region: z.string().optional(),
  category: z.string().optional()
});

// Route params validation schemas
export const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required')
});

export const dateRangeParamSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format. Use YYYY-MM-DD')
});

// Pagination query schema
export const paginationQuerySchema = z.object({
  page: z.string().regex(/^\d+$/, 'Page must be a number').optional().transform(val => val ? parseInt(val, 10) : 1),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').optional().transform(val => val ? parseInt(val, 10) : 50)
});

// Validation middleware factory
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten()
      });
    }
    req.query = result.data;
    next();
  };
};

export const validateParams = (schema: z.ZodSchema) => {
  return (req: any, res: any, next: any) => {
    const result = schema.safeParse(req.params);
    if (!result.success) {
      return res.status(400).json({
        error: 'Validation failed',
        details: result.error.flatten()
      });
    }
    req.params = result.data;
    next();
  };
};

// Export validation schemas for reuse
export const validationSchemas = {
  dateRangeQuery: dateRangeQuerySchema,
  idParam: idParamSchema,
  dateRangeParam: dateRangeParamSchema,
  paginationQuery: paginationQuerySchema
};
