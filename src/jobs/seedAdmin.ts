import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from '../config/env';
import { User, UserRole, AccountStatus } from '../models/User';
import { logger } from '../utils/logger';

const seedAdmin = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    logger.info('Connected to MongoDB for seeding');

    const adminEmail = 'admin@ghatkaari.com';
    const adminExists = await User.findOne({ email: adminEmail });

    if (adminExists) {
      logger.info('Admin user already exists');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@123', salt);

    const adminUser = new User({
      fullName: 'Super Admin',
      email: adminEmail,
      mobile: '9999999999',
      password: hashedPassword,
      role: UserRole.ADMIN,
      isEmailVerified: true,
      isMobileVerified: true,
      accountStatus: AccountStatus.ACTIVE,
    });

    await adminUser.save();
    logger.info('Admin user seeded successfully. Email: admin@ghatkaari.com, Password: Admin@123');
    
    process.exit(0);
  } catch (error) {
    logger.error('Error seeding admin user', error);
    process.exit(1);
  }
};

seedAdmin();
