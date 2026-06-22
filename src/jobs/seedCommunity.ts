import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from '../config/env';
import { User, UserRole, AccountStatus } from '../models/User';
import { CommunityDetails } from '../models/CommunityDetails';
import { logger } from '../utils/logger';

const seedCommunity = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to MongoDB for seeding');

    const communityEmail = 'community@ghatkaari.com';
    const existingUser = await User.findOne({ email: communityEmail });

    if (existingUser) {
      logger.info('Test Community user already exists');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Community@123', salt);

    // 1. Create User
    const communityUser = new User({
      fullName: 'Test Community Owner',
      email: communityEmail,
      mobile: '8888888888',
      password: hashedPassword,
      role: UserRole.COMMUNITY,
      isEmailVerified: true,
      isMobileVerified: true,
      accountStatus: AccountStatus.ACTIVE,
    });

    await communityUser.save();

    // 2. Create Community Profile
    const communityProfile = new CommunityDetails({
      userId: communityUser._id,
      communityName: 'Test Adventure Club',
      username: 'test-adventure-club',
      description: 'A test community for UI development.',
      phone: '8888888888',
      email: communityEmail,
      city: 'Pune',
      state: 'Maharashtra',
      country: 'India',
      isVerified: true,
    });

    await communityProfile.save();

    logger.info('Community user seeded successfully!');
    logger.info(`Email: ${communityEmail}`);
    logger.info('Password: Community@123');

    process.exit(0);
  } catch (error) {
    logger.error('Error seeding community user', error);
    process.exit(1);
  }
};

seedCommunity();
