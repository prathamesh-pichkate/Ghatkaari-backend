import mongoose, { Document, Schema } from 'mongoose';

export enum DriverRole {
  MAIN = 'MAIN',
  CO_DRIVER = 'CO_DRIVER',
  GUIDE = 'GUIDE',
}

export interface ITripDriver extends Document {
  tripId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  role: DriverRole;
  assignedAt: Date;
}

const tripDriverSchema = new Schema<ITripDriver>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, index: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    role: { type: String, enum: Object.values(DriverRole), default: DriverRole.MAIN },
  },
  { timestamps: { createdAt: 'assignedAt', updatedAt: false } }
);

// Prevent same driver being assigned multiple roles on the exact same trip
tripDriverSchema.index({ tripId: 1, driverId: 1 }, { unique: true });

export const TripDriver = mongoose.model<ITripDriver>('TripDriver', tripDriverSchema);
