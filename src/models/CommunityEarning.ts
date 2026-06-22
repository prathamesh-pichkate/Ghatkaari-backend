import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunityEarning extends Document {
  communityId: mongoose.Types.ObjectId;
  tripId: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  grossAmount: number;
  platformFee: number;
  netAmount: number;
  createdAt: Date;
}

const communityEarningSchema = new Schema<ICommunityEarning>(
  {
    communityId: { type: Schema.Types.ObjectId, ref: 'CommunityDetails', required: true, index: true },
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true, unique: true },
    grossAmount: { type: Number, required: true, min: 0 },
    platformFee: { type: Number, required: true, min: 0 },
    netAmount: { type: Number, required: true, min: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const CommunityEarning = mongoose.model<ICommunityEarning>('CommunityEarning', communityEarningSchema);
