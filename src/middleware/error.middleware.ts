import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { logger } from '../utils/logger';
import { AppError } from '../utils/appError';
import { sendError } from '../utils/response';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for dev
  logger.error(`[${req.method}] ${req.originalUrl} >> Error:: ${err.message}`, err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`;
    error = new AppError(message, 404);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new AppError(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val: any) => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // Zod validation error
  if (err instanceof ZodError) {
    const errors = err.issues.map((e: any) => ({ field: e.path.join('.'), message: e.message }));
    error = new AppError('Validation failed', 400, errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Invalid token. Please log in again.', 401);
  }

  if (err.name === 'TokenExpiredError') {
    error = new AppError('Your token has expired. Please log in again.', 401);
  }

  const statusCode = error.statusCode || 500;
  const message = error.message || 'Server Error';
  
  const responseObj: any = {
    success: false,
    message,
  };

  if (error.errors) {
    responseObj.errors = error.errors;
  }

  if (env.NODE_ENV === 'development') {
    responseObj.stack = err.stack;
  }

  res.status(statusCode).json(responseObj);
};
