import mongoose, { Document, Schema } from 'mongoose';

export enum PartnerRequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface IPartnerRequest extends Document {
  communityName: string;
  ownerName: string;
  email: string;
  mobile: string;
  instagramUrl?: string;
  website?: string;
  status: PartnerRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}

const partnerRequestSchema = new Schema<IPartnerRequest>(
  {
    communityName: { type: String, required: true, trim: true },
    ownerName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    mobile: { type: String, required: true },
    instagramUrl: { type: String },
    website: { type: String },
    status: {
      type: String,
      enum: Object.values(PartnerRequestStatus),
      default: PartnerRequestStatus.PENDING,
      required: true,
    },
  },
  { timestamps: true }
);

export const PartnerRequest = mongoose.model<IPartnerRequest>('PartnerRequest', partnerRequestSchema);
