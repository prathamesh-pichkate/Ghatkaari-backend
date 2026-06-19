import { Request, Response } from 'express';
import { Community } from '../../../models/Community';
import { User } from '../../../models/User';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendSuccess } from '../../../utils/response';
import bcrypt from 'bcrypt';
import { AppError } from '../../../utils/appError';

export class CommunityController {
  public getProfile = asyncHandler(async (req: Request, res: Response) => {
    const community = await Community.findOne({ userId: req.user._id });
    sendSuccess(res, 200, 'Profile retrieved', { community, user: req.user });
  });

  public changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    
    // In a real app we need the plain hashed password for comparison, 
    // so we'd fetch the user again explicitly selecting password.
    const user = await User.findById(req.user._id).select('+password');
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(oldPassword, user.password!);
    if (!isMatch) throw new AppError('Incorrect old password', 400);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    sendSuccess(res, 200, 'Password changed successfully');
  });
}

export const communityController = new CommunityController();
