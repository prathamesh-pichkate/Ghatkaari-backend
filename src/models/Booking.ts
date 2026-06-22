import mongoose, { Document, Schema } from 'mongoose';

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

interface IPassenger {
  name: string;
  age: number;
  gender: string;
  seatNumber: string;
}

export interface IBooking extends Document {
  tripId: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  seatNumbers: string[];
  passengers: IPassenger[];
  totalAmount: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  bookedAt: Date;
}

const passengerSchema = new Schema<IPassenger>(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    seatNumber: { type: String, required: true },
  },
  { _id: false }
);

const bookingSchema = new Schema<IBooking>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'CommunityDetails', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    seatNumbers: [{ type: String, required: true }],
    passengers: [passengerSchema],
    totalAmount: { type: Number, required: true, min: 0 },
    bookingStatus: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
  },
  { timestamps: { createdAt: 'bookedAt', updatedAt: false } }
);

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
