import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  image?: string;
}

const categorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    image: { type: String },
  },
  { timestamps: false }
);

export const Category = mongoose.model<ICategory>('Category', categorySchema);
