import { Request, Response } from 'express';
import { partnerService } from './partner.service';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendSuccess } from '../../../utils/response';

export class PartnerController {
  public createRequest = asyncHandler(async (req: Request, res: Response) => {
    const result = await partnerService.createRequest(req.body);
    sendSuccess(res, 201, 'Partner request submitted successfully', result);
  });

  public getStatus = asyncHandler(async (req: Request, res: Response) => {
    const result = await partnerService.getStatus(req.params.id as string);
    sendSuccess(res, 200, 'Partner request status retrieved', { status: result.status });
  });
}

export const partnerController = new PartnerController();
