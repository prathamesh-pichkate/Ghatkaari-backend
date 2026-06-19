import mongoose, { Document, Schema } from 'mongoose';

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export interface IBooking extends Document {
  tripId: mongoose.Types.ObjectId;
  customerId: mongoose.Types.ObjectId;
  bookingDate: Date;
  passengers: number;
  totalAmount: number;
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    customerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    bookingDate: { type: Date, default: Date.now, required: true },
    passengers: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: { 
      type: String, 
      enum: Object.values(PaymentStatus), 
      default: PaymentStatus.PENDING,
      required: true 
    },
    bookingStatus: { 
      type: String, 
      enum: Object.values(BookingStatus), 
      default: BookingStatus.CONFIRMED,
      required: true 
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
