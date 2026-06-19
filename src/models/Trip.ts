import mongoose, { Document, Schema } from 'mongoose';

export enum TripStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IItineraryDay {
  dayNumber: number;
  title: string;
  activities: string[];
  meals?: string[];
}

export interface ITrip extends Document {
  communityId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  destinationId: mongoose.Types.ObjectId;
  categoryId: mongoose.Types.ObjectId;
  description: string;
  price: number;
  startDate: Date;
  endDate: Date;
  totalSeats: number;
  bookedSeats: number;
  images: string[];
  status: TripStatus;
  itinerary: IItineraryDay[];
  createdAt: Date;
  updatedAt: Date;
}

const itinerarySchema = new Schema<IItineraryDay>(
  {
    dayNumber: { type: Number, required: true },
    title: { type: String, required: true },
    activities: [{ type: String, required: true }],
    meals: [{ type: String }],
  },
  { _id: false } // No need for separate ObjectIds for embedded days
);

const tripSchema = new Schema<ITrip>(
  {
    communityId: { type: Schema.Types.ObjectId, ref: 'Community', required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    destinationId: { type: Schema.Types.ObjectId, ref: 'Destination', required: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalSeats: { type: Number, required: true, min: 1 },
    bookedSeats: { type: Number, required: true, default: 0, min: 0 },
    images: [{ type: String, required: true }],
    status: { 
      type: String, 
      enum: Object.values(TripStatus), 
      default: TripStatus.DRAFT,
      required: true 
    },
    itinerary: [itinerarySchema],
  },
  { timestamps: true }
);

// Indexes for faster querying
tripSchema.index({ communityId: 1 });
tripSchema.index({ destinationId: 1 });

export const Trip = mongoose.model<ITrip>('Trip', tripSchema);
