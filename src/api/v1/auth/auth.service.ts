import bcrypt from 'bcrypt';
import { authRepository } from './auth.repository';
import { SignupDTO, LoginDTO, OtpVerificationDTO } from './auth.types';
import { AppError } from '../../../utils/appError';
import { generateAccessToken, generateRefreshToken } from '../../../utils/jwt';
import redisClient from '../../../config/redis';
import { sendEmailVerificationOTP } from '../../../utils/email';
import { UserRole, AccountStatus } from '../../../models/User';
import { logger } from '../../../utils/logger';

export class AuthService {
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit OTP
  }

  public async sendEmailOtp(email: string) {
    const existingEmail = await authRepository.findByEmail(email);
    if (existingEmail) throw new AppError('Email already registered', 400);

    const emailOtp = this.generateOTP();
    await redisClient.setEx(`email_otp:${email}`, 300, emailOtp); // 5 mins expiry
    await sendEmailVerificationOTP(email, emailOtp);

    return { message: 'Email OTP sent successfully' };
  }

  public async sendMobileOtp(mobile: string) {
    const existingMobile = await authRepository.findByMobile(mobile);
    if (existingMobile) throw new AppError('Mobile number already registered', 400);

    const mobileOtp = this.generateOTP();
    await redisClient.setEx(`mobile_otp:${mobile}`, 300, mobileOtp); // 5 mins expiry
    logger.info(`[MOCK SMS] OTP for ${mobile} is ${mobileOtp}`);

    return { message: 'Mobile OTP sent successfully' };
  }

  public async verifyEmailOtp({ email, otp }: OtpVerificationDTO) {
    const storedOtp = await redisClient.get(`email_otp:${email}`);
    if (!storedOtp) throw new AppError('OTP expired or invalid', 400);
    if (storedOtp !== otp) throw new AppError('Incorrect OTP', 400);

    // Create a verified ticket valid for 30 minutes
    await redisClient.setEx(`verified_email:${email}`, 1800, 'true');
    await redisClient.del(`email_otp:${email}`);

    return { message: 'Email verified successfully. Proceed to next step.' };
  }

  public async verifyMobileOtp({ mobile, otp }: OtpVerificationDTO) {
    const storedOtp = await redisClient.get(`mobile_otp:${mobile}`);
    if (!storedOtp) throw new AppError('OTP expired or invalid', 400);
    if (storedOtp !== otp) throw new AppError('Incorrect OTP', 400);

    // Create a verified ticket valid for 30 minutes
    await redisClient.setEx(`verified_mobile:${mobile}`, 1800, 'true');
    await redisClient.del(`mobile_otp:${mobile}`);

    return { message: 'Mobile verified successfully. Proceed to signup.' };
  }

  public async signup(data: SignupDTO) {
    // 1. Check verified tickets in Redis
    const isEmailVerified = await redisClient.get(`verified_email:${data.email}`);
    if (!isEmailVerified) throw new AppError('Please verify your email before signing up', 403);

    const isMobileVerified = await redisClient.get(`verified_mobile:${data.mobile}`);
    if (!isMobileVerified) throw new AppError('Please verify your mobile number before signing up', 403);

    // 2. Final check if they somehow got created in the DB in parallel
    const existingEmail = await authRepository.findByEmail(data.email);
    if (existingEmail) throw new AppError('Email already in use', 400);

    const existingMobile = await authRepository.findByMobile(data.mobile);
    if (existingMobile) throw new AppError('Mobile number already in use', 400);

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password!, salt);

    // 4. Create user
    const user = await authRepository.createUser({
      ...data,
      password: hashedPassword,
      role: UserRole.CUSTOMER,
      accountStatus: AccountStatus.ACTIVE, // Immediately active since they verified pre-signup
      isEmailVerified: true,
      isMobileVerified: true,
    });

    // 5. Cleanup Redis tickets
    await redisClient.del(`verified_email:${data.email}`);
    await redisClient.del(`verified_mobile:${data.mobile}`);

    return {
      userId: user._id,
      email: user.email,
      message: 'Signup successful! You can now log in.',
    };
  }

  public async login({ email, password }: LoginDTO) {
    const user = await authRepository.findByEmail(email);
    if (!user || !user.password) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordMatch = await bcrypt.compare(password!, user.password);
    if (!isPasswordMatch) {
      throw new AppError('Invalid credentials', 401);
    }

    if (user.accountStatus === AccountStatus.SUSPENDED) {
      throw new AppError('Account suspended', 403);
    }

    if (user.accountStatus === AccountStatus.DELETED) {
      throw new AppError('Account deleted', 401);
    }

    const accessToken = generateAccessToken((user._id as any).toString(), user.role);
    const refreshToken = generateRefreshToken((user._id as any).toString(), user.role);

    await authRepository.updateRefreshToken((user._id as any).toString(), refreshToken);

    return {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }

  public async logout(userId: string) {
    await authRepository.updateRefreshToken(userId, null);
    return { message: 'Logged out successfully' };
  }
}

export const authService = new AuthService();
