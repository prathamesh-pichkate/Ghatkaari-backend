import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/appError';
import { verifyAccessToken } from '../utils/jwt';
import { User } from '../models/User';
import { asyncHandler } from '../utils/asyncHandler';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  let token;

  // 1. Get token from cookies or auth header
  if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2. Verify token
  const decoded = verifyAccessToken(token);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.userId).select('+accountStatus');
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // 4. Check account status
  if (currentUser.accountStatus === 'SUSPENDED') {
    return next(new AppError('Your account has been suspended. Please contact support.', 403));
  }
  if (currentUser.accountStatus === 'DELETED') {
    return next(new AppError('Your account has been deleted.', 401));
  }

  // GRANT ACCESS
  req.user = currentUser;
  next();
});

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
