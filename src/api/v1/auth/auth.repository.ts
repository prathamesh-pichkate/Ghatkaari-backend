import { User, IUser, AccountStatus } from '../../../models/User';
import { SignupDTO } from './auth.types';

export class AuthRepository {
  public async findByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  public async findByMobile(mobile: string): Promise<IUser | null> {
    return User.findOne({ mobile });
  }

  public async findById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  public async createUser(data: SignupDTO & { role?: string, accountStatus?: AccountStatus, isEmailVerified?: boolean, isMobileVerified?: boolean }): Promise<IUser> {
    const user = new User(data);
    return user.save();
  }

  public async updateRefreshToken(userId: string, token: string | null): Promise<void> {
    await User.findByIdAndUpdate(userId, { refreshToken: token });
  }

  public async verifyEmail(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { 
      isEmailVerified: true,
      accountStatus: AccountStatus.ACTIVE // Activate account upon email verification (simplified flow)
    });
  }

  public async verifyMobile(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { isMobileVerified: true });
  }
}

export const authRepository = new AuthRepository();
