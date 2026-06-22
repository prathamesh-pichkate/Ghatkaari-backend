import mongoose, { Document, Schema } from 'mongoose';
import { VerificationStatus } from './CommunityDetails';

export enum DocumentType {
  GST = 'GST',
  PAN = 'PAN',
  INCORPORATION_CERTIFICATE = 'INCORPORATION_CERTIFICATE',
  ADDRESS_PROOF = 'ADDRESS_PROOF',
  OTHER = 'OTHER',
}

export interface ICommunityDocument extends Document {
  communityDetailsId: mongoose.Types.ObjectId;
  documentType: DocumentType;
  documentUrl: string;
  verificationStatus: VerificationStatus;
  uploadedAt: Date;
}

const communityDocumentSchema = new Schema<ICommunityDocument>(
  {
    communityDetailsId: { type: Schema.Types.ObjectId, ref: 'CommunityDetails', required: true, index: true },
    documentType: { type: String, enum: Object.values(DocumentType), required: true },
    documentUrl: { type: String, required: true },
    verificationStatus: { type: String, enum: Object.values(VerificationStatus), default: VerificationStatus.PENDING },
  },
  { timestamps: { createdAt: 'uploadedAt', updatedAt: false } }
);

export const CommunityDocument = mongoose.model<ICommunityDocument>('CommunityDocument', communityDocumentSchema);
