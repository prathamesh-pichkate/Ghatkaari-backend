import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  tripId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  rating: number;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

// Prevent a user from leaving multiple reviews for the same trip
reviewSchema.index({ tripId: 1, customerId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
