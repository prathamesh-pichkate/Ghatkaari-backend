import { z } from 'zod';

export const signupSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').optional(),
    mobile: z.string().optional(),
    otp: z.string().length(6, 'OTP must be 6 digits'),
  }),
});

export const sendEmailOtpSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
  }),
});

export const sendMobileOtpSchema = z.object({
  body: z.object({
    mobile: z.string().regex(/^[0-9]{10}$/, 'Mobile number must be 10 digits'),
  }),
});

export const refreshTokenSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      message: 'Refresh token is required',
    }),
  }),
});
