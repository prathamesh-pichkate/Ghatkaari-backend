import mongoose, { Document, Schema } from 'mongoose';

interface IItineraryDay {
  day: number;
  title: string;
  description: string;
}

interface IPoint {
  location: string;
  time: string;
}

export interface ITripDetail extends Document {
  tripId: mongoose.Types.ObjectId;
  communityId: mongoose.Types.ObjectId;
  aboutTrip: string;
  images: string[];
  whyThisTrip: string[];
  itinerary: IItineraryDay[];
  inclusions: string[];
  exclusions: string[];
  thingsToCarry: string[];
  importantRules: string[];
  boardingPoints: IPoint[];
  droppingPoints: IPoint[];
  createdAt: Date;
  updatedAt: Date;
}

const itinerarySchema = new Schema<IItineraryDay>(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const pointSchema = new Schema<IPoint>(
  {
    location: { type: String, required: true },
    time: { type: String, required: true },
  },
  { _id: false }
);

const tripDetailSchema = new Schema<ITripDetail>(
  {
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true, unique: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'CommunityDetails', required: true },
    aboutTrip: { type: String, required: true },
    images: [{ type: String }],
    whyThisTrip: [{ type: String }],
    itinerary: [itinerarySchema],
    inclusions: [{ type: String }],
    exclusions: [{ type: String }],
    thingsToCarry: [{ type: String }],
    importantRules: [{ type: String }],
    boardingPoints: [pointSchema],
    droppingPoints: [pointSchema],
  },
  { timestamps: true }
);

export const TripDetail = mongoose.model<ITripDetail>('TripDetail', tripDetailSchema);
