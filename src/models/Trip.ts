import mongoose, { Document, Schema } from 'mongoose';

export enum TripStatus {
  UPCOMING = 'UPCOMING',
  ONGOING = 'ONGOING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface ITrip extends Document {
  communityId: mongoose.Types.ObjectId;
  busId: mongoose.Types.ObjectId;
  title: string;
  source: string;
  destination: string;
  startDate: Date;
  endDate: Date;
  pricePerSeat: number;
  totalSeats: number;
  availableSeats: number;
  bookedSeats: number;
  tripStatus: TripStatus;
  createdAt: Date;
  updatedAt: Date;
}

const tripSchema = new Schema<ITrip>(
  {
    communityId: { type: Schema.Types.ObjectId, ref: 'CommunityDetails', required: true, index: true },
    busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
    title: { type: String, required: true, trim: true },
    source: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    pricePerSeat: { type: Number, required: true, min: 0 },
    totalSeats: { type: Number, required: true, min: 0 },
    availableSeats: { type: Number, required: true, min: 0 },
    bookedSeats: { type: Number, default: 0, min: 0 },
    tripStatus: { type: String, enum: Object.values(TripStatus), default: TripStatus.UPCOMING },
  },
  { timestamps: true }
);

tripSchema.index({ source: 'text', destination: 'text', title: 'text' });

export const Trip = mongoose.model<ITrip>('Trip', tripSchema);
