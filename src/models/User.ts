import mongoose, { Document, Schema } from 'mongoose';

export enum UserRole {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER',
  COMMUNITY = 'COMMUNITY',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  mobile: string;
  password?: string;
  role: UserRole;
  isEmailVerified: boolean;
  isMobileVerified: boolean;
  accountStatus: AccountStatus;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: false
    }, // Optional for OAuth
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.CUSTOMER,
      required: true
    },
    mobile: {
      type: String,
      required: true,
      unique: true
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    isMobileVerified: {
      type: Boolean,
      default: false
    },
    accountStatus: {
      type: String,
      enum: Object.values(AccountStatus),
      default: AccountStatus.PENDING
    },
    refreshToken: {
      type: String
    }
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>('User', userSchema);
