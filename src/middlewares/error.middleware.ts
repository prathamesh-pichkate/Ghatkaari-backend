import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { logger } from '../utils/logger';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  logger.error(`[${req.method}] ${req.originalUrl} >> StatusCode:: ${statusCode}, Message:: ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};
