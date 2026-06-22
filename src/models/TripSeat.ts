import mongoose, { Document, Schema } from 'mongoose';

export enum SeatStatus {
  AVAILABLE = 'AVAILABLE',
  BLOCKED = 'BLOCKED',
  BOOKED = 'BOOKED',
}

export interface ITripSeat extends Document {
  tripId: mongoose.Types.ObjectId;
  seatNumber: string;
  seatStatus: SeatStatus;
  bookedBy?: mongoose.Types.ObjectId; // Null if available
  updatedAt: Date;
}

const tripSeatSchema = new Schema<ITripSeat>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    seatNumber: { type: String, required: true, trim: true },
    seatStatus: { type: String, enum: Object.values(SeatStatus), default: SeatStatus.AVAILABLE },
    bookedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

// Ensures a specific seat number is unique per trip
tripSeatSchema.index({ tripId: 1, seatNumber: 1 }, { unique: true });

export const TripSeat = mongoose.model<ITripSeat>('TripSeat', tripSeatSchema);
