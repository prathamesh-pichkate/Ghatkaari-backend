import mongoose, { Document, Schema } from 'mongoose';

export interface IBus extends Document {
  communityId: mongoose.Types.ObjectId;
  layoutTemplateId: mongoose.Types.ObjectId;
  busName: string;
  vehicleNumber: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  manufacturingYear?: number;
  vehicleType: string;
  seatType: string;
  totalSeats: number;
  amenities: string[];
  images: string[];
  insuranceNumber?: string;
  permitNumber?: string;
  fitnessCertificate?: string;
  pollutionCertificate?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const busSchema = new Schema<IBus>(
  {
    communityId: { type: Schema.Types.ObjectId, ref: 'CommunityDetails', required: true, index: true },
    layoutTemplateId: { type: Schema.Types.ObjectId, ref: 'SeatLayoutTemplate', required: true },
    busName: { type: String, required: true, trim: true },
    vehicleNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    vehicleBrand: { type: String, trim: true },
    vehicleModel: { type: String, trim: true },
    manufacturingYear: { type: Number },
    vehicleType: { type: String, required: true },
    seatType: { type: String, required: true },
    totalSeats: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    insuranceNumber: { type: String, trim: true },
    permitNumber: { type: String, trim: true },
    fitnessCertificate: { type: String, trim: true },
    pollutionCertificate: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Bus = mongoose.model<IBus>('Bus', busSchema);
