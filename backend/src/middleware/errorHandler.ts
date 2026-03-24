import { Request, Response, NextFunction } from 'express';

interface AppError extends Error {
  statusCode?: number;
  details?: any;
}

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    error: 'Route not found',
    details: {
      path: req.originalUrl,
      method: req.method
    }
  });
};

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    ...(err.details && { details: err.details }),
    ...(isProduction && statusCode === 500 && { details: undefined })
  });
};

export const createError = (message: string, statusCode: number, details?: any): AppError => {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.details = details;
  return error;
};
