import mongoose, { Document, Schema } from 'mongoose';

export interface ISeatLayoutTemplate extends Document {
  templateName: string;
  vehicleType: string;
  totalSeats: number;
  seats: any[]; // Can be defined strictly later depending on UI structure
  createdAt: Date;
  updatedAt: Date;
}

const seatLayoutTemplateSchema = new Schema<ISeatLayoutTemplate>(
  {
    templateName: { type: String, required: true, unique: true, trim: true },
    vehicleType: { type: String, required: true, trim: true },
    totalSeats: { type: Number, required: true },
    seats: [{ type: Schema.Types.Mixed }],
  },
  { timestamps: true }
);

export const SeatLayoutTemplate = mongoose.model<ISeatLayoutTemplate>('SeatLayoutTemplate', seatLayoutTemplateSchema);
