import mongoose, { Document, Schema } from 'mongoose';

export interface IDriver extends Document {
  communityId: mongoose.Types.ObjectId;
  fullName: string;
  phone: string;
  alternatePhone?: string;
  address: string;
  aadhaarNumber: string;
  drivingLicenseNumber: string;
  drivingLicenseImage?: string;
  experienceYears?: number;
  emergencyContact?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const driverSchema = new Schema<IDriver>(
  {
    communityId: { type: Schema.Types.ObjectId, ref: 'CommunityDetails', required: true, index: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    alternatePhone: { type: String, trim: true },
    address: { type: String, required: true },
    aadhaarNumber: { type: String, required: true, unique: true, trim: true },
    drivingLicenseNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    drivingLicenseImage: { type: String },
    experienceYears: { type: Number, min: 0 },
    emergencyContact: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Driver = mongoose.model<IDriver>('Driver', driverSchema);
