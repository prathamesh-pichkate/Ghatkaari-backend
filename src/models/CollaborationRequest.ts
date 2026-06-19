import mongoose, { Document, Schema } from 'mongoose';

export enum CollaborationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface ICollaborationRequest extends Document {
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  status: CollaborationStatus;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const collaborationRequestSchema = new Schema<ICollaborationRequest>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { 
      type: String, 
      enum: Object.values(CollaborationStatus), 
      default: CollaborationStatus.PENDING,
      required: true 
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

export const CollaborationRequest = mongoose.model<ICollaborationRequest>('CollaborationRequest', collaborationRequestSchema);
