import mongoose, { Document, Schema } from 'mongoose';

export interface IDestination extends Document {
  name: string;
  state: string;
  description?: string;
}

const destinationSchema = new Schema<IDestination>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    state: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: false }
);

export const Destination = mongoose.model<IDestination>('Destination', destinationSchema);
