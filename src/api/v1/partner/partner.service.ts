import { PartnerRequest, PartnerRequestStatus } from '../../../models/PartnerRequest';
import { AppError } from '../../../utils/appError';

export class PartnerService {
  public async createRequest(data: any) {
    const existingRequest = await PartnerRequest.findOne({ 
      $or: [{ email: data.email }, { mobile: data.mobile }]
    });

    if (existingRequest) {
      throw new AppError('A partner request with this email or mobile already exists.', 400);
    }

    const request = new PartnerRequest(data);
    await request.save();
    return request;
  }

  public async getStatus(id: string) {
    const request = await PartnerRequest.findById(id);
    if (!request) throw new AppError('Partner request not found', 404);
    return request;
  }
}

export const partnerService = new PartnerService();
