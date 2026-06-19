import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { PartnerRequest, PartnerRequestStatus } from '../../../models/PartnerRequest';
import { User, UserRole, AccountStatus } from '../../../models/User';
import { Community } from '../../../models/Community';
import { AppError } from '../../../utils/appError';
import { sendCommunityCredentials } from '../../../utils/email';

export class AdminService {
  private generateTemporaryPassword(): string {
    return crypto.randomBytes(8).toString('hex'); // 16 char secure string
  }

  public async getPendingRequests() {
    return PartnerRequest.find({ status: PartnerRequestStatus.PENDING });
  }

  public async approveCommunity(requestId: string) {
    const request = await PartnerRequest.findById(requestId);
    if (!request) throw new AppError('Partner request not found', 404);
    if (request.status !== PartnerRequestStatus.PENDING) {
      throw new AppError('Request is not in pending state', 400);
    }

    // 1. Generate temp password
    const tempPassword = this.generateTemporaryPassword();
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(tempPassword, salt);

    // 2. Create User
    const user = new User({
      fullName: request.ownerName,
      email: request.email,
      mobile: request.mobile,
      password: hashedPassword,
      role: UserRole.COMMUNITY,
      isEmailVerified: true, // Auto verified for community
      isMobileVerified: true,
      accountStatus: AccountStatus.ACTIVE,
    });
    await user.save();

    // 3. Create Community Profile
    const community = new Community({
      userId: user._id,
      communityName: request.communityName,
      description: 'Please update your description.',
      city: 'To be updated',
      state: 'To be updated',
      isVerified: true,
    });
    await community.save();

    // 4. Update Request Status
    request.status = PartnerRequestStatus.APPROVED;
    await request.save();

    // 5. Send Credentials
    await sendCommunityCredentials(user.email, request.communityName, tempPassword);

    return { message: 'Community approved and credentials sent successfully' };
  }

  public async rejectCommunity(requestId: string) {
    const request = await PartnerRequest.findById(requestId);
    if (!request) throw new AppError('Partner request not found', 404);
    
    request.status = PartnerRequestStatus.REJECTED;
    await request.save();
    return { message: 'Community request rejected' };
  }
}

export const adminService = new AdminService();
