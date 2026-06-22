import mongoose, { Document, Schema } from 'mongoose';

export enum VerificationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface ICommunityDetails extends Document {
  userId: mongoose.Types.ObjectId;
  communityName: string;
  username: string;
  description: string;
  logo?: string;
  coverImage?: string;
  phone: string;
  alternatePhone?: string;
  email: string;
  city: string;
  state: string;
  country: string;
  website?: string;
  instagram?: string;
  facebook?: string;
  whatsapp?: string;
  isVerified: boolean;
  isProfileCompleted: boolean;
  isActive: boolean;
  verificationStatus: VerificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const communityDetailsSchema = new Schema<ICommunityDetails>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    communityName: { type: String, required: true, trim: true },
    username: { type: String, unique: true, index: true, sparse: true, trim: true, lowercase: true },
    description: { type: String, required: true },
    logo: { type: String },
    coverImage: { type: String },
    phone: { type: String, required: true, trim: true },
    alternatePhone: { type: String, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    website: { type: String, trim: true },
    instagram: { type: String, trim: true },
    facebook: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    isVerified: { type: Boolean, default: false },
    isProfileCompleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    verificationStatus: { type: String, enum: Object.values(VerificationStatus), default: VerificationStatus.PENDING },
  },
  { timestamps: true }
);

communityDetailsSchema.index({ communityName: 'text' });

export const CommunityDetails = mongoose.model<ICommunityDetails>('CommunityDetails', communityDetailsSchema);
