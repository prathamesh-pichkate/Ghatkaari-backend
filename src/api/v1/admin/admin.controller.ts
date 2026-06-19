import { Request, Response } from 'express';
import { adminService } from './admin.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendSuccess } from '../../../utils/response';

export class AdminController {
  public getPendingRequests = asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.getPendingRequests();
    sendSuccess(res, 200, 'Pending requests retrieved', result);
  });

  public approveCommunity = asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.approveCommunity(req.body.requestId);
    sendSuccess(res, 200, result.message);
  });

  public rejectCommunity = asyncHandler(async (req: Request, res: Response) => {
    const result = await adminService.rejectCommunity(req.body.requestId);
    sendSuccess(res, 200, result.message);
  });
}

export const adminController = new AdminController();
