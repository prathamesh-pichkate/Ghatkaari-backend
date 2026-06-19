import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Types } from 'mongoose';

export interface TokenPayload {
  userId: string;
  role: string;
}

export const generateAccessToken = (userId: string | Types.ObjectId, role: string): string => {
  return jwt.sign({ userId: userId.toString(), role }, env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

export const generateRefreshToken = (userId: string | Types.ObjectId, role: string): string => {
  return jwt.sign({ userId: userId.toString(), role }, env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
};
