import { Request, Response } from 'express';
import { authService } from './auth.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendSuccess } from '../../../utils/response';
import { env } from '../../../config/env';

export class AuthController {
  public sendEmailOtp = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.sendEmailOtp(req.body.email);
    sendSuccess(res, 200, result.message);
  });

  public sendMobileOtp = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.sendMobileOtp(req.body.mobile);
    sendSuccess(res, 200, result.message);
  });

  public verifyEmailOtp = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.verifyEmailOtp(req.body);
    sendSuccess(res, 200, result.message);
  });

  public verifyMobileOtp = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.verifyMobileOtp(req.body);
    sendSuccess(res, 200, result.message);
  });

  public signup = asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.signup(req.body);
    sendSuccess(res, 201, result.message, result);
  });

  public login = asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    // Set cookies
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 mins
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(res, 200, 'Login successful', { user, accessToken });
  });

  public logout = asyncHandler(async (req: Request, res: Response) => {
    if (req.user) {
      await authService.logout(req.user._id);
    }

    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    sendSuccess(res, 200, 'Logged out successfully');
  });

  public profile = asyncHandler(async (req: Request, res: Response) => {
    sendSuccess(res, 200, 'Profile retrieved', { user: req.user });
  });
}

export const authController = new AuthController();
