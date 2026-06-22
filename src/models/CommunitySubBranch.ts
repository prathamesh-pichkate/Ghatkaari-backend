import mongoose, { Document, Schema } from 'mongoose';

export interface ICommunitySubBranch extends Document {
  communityDetailsId: mongoose.Types.ObjectId;
  branchName: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const communitySubBranchSchema = new Schema<ICommunitySubBranch>(
  {
    communityDetailsId: { type: Schema.Types.ObjectId, ref: 'CommunityDetails', required: true, index: true },
    branchName: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, default: 'India' },
    phone: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export const CommunitySubBranch = mongoose.model<ICommunitySubBranch>('CommunitySubBranch', communitySubBranchSchema);
