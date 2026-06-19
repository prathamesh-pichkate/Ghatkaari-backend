import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunity extends Document {
  userId: mongoose.Types.ObjectId;
  communityName: string;
  description: string;
  city: string;
  state: string;
  logo?: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const communitySchema = new Schema<ICommunity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    communityName: { type: String, required: true, unique: true, trim: true },
    description: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    logo: { type: String },
    isVerified: { type: Boolean, default: false, required: true },
  },
  { timestamps: true }
);

export const Community = mongoose.model<ICommunity>('Community', communitySchema);
