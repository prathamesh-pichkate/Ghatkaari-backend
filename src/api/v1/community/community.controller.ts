import { Request, Response } from 'express';
import { CommunityDetails } from '../../../models/CommunityDetails';
import { User } from '../../../models/User';
import { asyncHandler } from '../../../utils/asyncHandler';
import { sendSuccess } from '../../../utils/response';
import bcrypt from 'bcrypt';
import { AppError } from '../../../utils/appError';
import { uploadToCloudinary } from '../../../utils/cloudinary';
import { CommunityDocument, DocumentType } from '../../../models/CommunityDocument';
import { CommunitySubBranch } from '../../../models/CommunitySubBranch';
import { VerificationStatus } from '../../../models/CommunityDetails';

export class CommunityController {
  public getProfile = asyncHandler(async (req: Request, res: Response) => {
    let community = await CommunityDetails.findOne({ userId: req.user._id });
    
    // If it doesn't exist, create the fallback so the frontend always has a profile to render
    if (!community) {
      const user = await User.findById(req.user._id);
      community = new CommunityDetails({
        userId: req.user._id,
        communityName: user?.fullName || 'Unnamed Community',
        description: 'Please update your description',
        phone: user?.mobile || '0000000000',
        email: user?.email || 'update@email.com',
        city: 'Unknown',
        state: 'Unknown',
        country: 'India',
        isVerified: false
      });
      if (community.communityName) {
         community.username = community.communityName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
      await community.save();
    }

    // Fetch related documents and branches
    const documents = await CommunityDocument.find({ communityDetailsId: community._id });
    const branches = await CommunitySubBranch.find({ communityDetailsId: community._id });

    sendSuccess(res, 200, 'Profile retrieved', { 
      community, 
      documents, 
      branches, 
      user: req.user 
    });
  });

  public changePassword = asyncHandler(async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;

    // In a real app we need the plain hashed password for comparison, 
    // so we'd fetch the user again explicitly selecting password.
    const user = await User.findById(req.user._id).select('+password');
    if (!user) throw new AppError('User not found', 404);

    const isMatch = await bcrypt.compare(oldPassword, user.password!);
    if (!isMatch) throw new AppError('Incorrect old password', 400);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    sendSuccess(res, 200, 'Password changed successfully');
  });

  public updateBasicDetails = asyncHandler(async (req: Request, res: Response) => {
    const { description, alternatePhone, city, state, website, instagram, facebook, whatsapp } = req.body;

    // Find community or create it if it doesn't exist yet
    let community = await CommunityDetails.findOne({ userId: req.user._id });
    if (!community) {
      // Get the user data for the restricted fields
      const user = await User.findById(req.user._id);
      
      community = new CommunityDetails({
        userId: req.user._id,
        communityName: user?.fullName || 'Unnamed Community',
        description: description || 'Please update your description',
        phone: user?.mobile || '0000000000',
        email: user?.email || 'update@email.com',
        city: city || 'Unknown',
        state: state || 'Unknown',
        country: 'India',
        isVerified: false
      });
      
      // Generate initial slug
      if (community.communityName) {
         community.username = community.communityName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      }
    }

    // Handle Image Uploads via Cloudinary
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.logo && files.logo.length > 0) {
      community.logo = await uploadToCloudinary(files.logo[0].buffer, `community/${community._id}/logo`);
    }

    if (files?.coverImage && files.coverImage.length > 0) {
      community.coverImage = await uploadToCloudinary(files.coverImage[0].buffer, `community/${community._id}/cover`);
    }

    // Update allowable fields (Restricted fields like communityName, email, phone are IGNORED)
    if (description) community.description = description;
    if (alternatePhone !== undefined) community.alternatePhone = alternatePhone;
    if (city) community.city = city;
    if (state) community.state = state;
    if (website !== undefined) community.website = website;
    if (instagram !== undefined) community.instagram = instagram;
    if (facebook !== undefined) community.facebook = facebook;
    if (whatsapp !== undefined) community.whatsapp = whatsapp;

    await community.save();

    sendSuccess(res, 200, 'Basic details updated successfully', { community });
  });

  public uploadDocuments = asyncHandler(async (req: Request, res: Response) => {
    let community = await CommunityDetails.findOne({ userId: req.user._id });
    if (!community) {
      community = new CommunityDetails({
        userId: req.user._id,
        communityName: 'Unnamed Community',
        description: 'Please update your description',
        phone: '0000000000',
        email: 'update@email.com',
        city: 'Unknown',
        state: 'Unknown',
        country: 'India',
        isVerified: false
      });
      await community.save(); // Save it so we have a valid community._id for the documents
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const uploadedDocs: any[] = [];

    // Helper to process document
    const processDoc = async (fileArray: Express.Multer.File[], type: DocumentType) => {
      if (fileArray && fileArray.length > 0) {
        const secureUrl = await uploadToCloudinary(fileArray[0].buffer, `community/${community._id}/documents`);

        // Upsert document record
        const doc = await CommunityDocument.findOneAndUpdate(
          { communityDetailsId: community._id, documentType: type },
          { documentUrl: secureUrl, verificationStatus: VerificationStatus.PENDING },
          { new: true, upsert: true }
        );
        uploadedDocs.push(doc);
      }
    };

    await processDoc(files?.gst_certificate, DocumentType.GST);
    await processDoc(files?.pan_card, DocumentType.PAN);
    await processDoc(files?.incorporation_certificate, DocumentType.INCORPORATION_CERTIFICATE);
    await processDoc(files?.address_proof, DocumentType.ADDRESS_PROOF);

    sendSuccess(res, 200, 'Documents uploaded successfully', { documents: uploadedDocs });
  });

  public updateSubBranches = asyncHandler(async (req: Request, res: Response) => {
    const { branches } = req.body; // Array of branch objects
    if (!Array.isArray(branches)) throw new AppError('Branches must be an array', 400);

    let community = await CommunityDetails.findOne({ userId: req.user._id });
    if (!community) {
      community = new CommunityDetails({
        userId: req.user._id,
        communityName: 'Unnamed Community',
        description: 'Please update your description',
        phone: '0000000000',
        email: 'update@email.com',
        city: 'Unknown',
        state: 'Unknown',
        country: 'India',
        isVerified: false
      });
      await community.save(); // Save it so we have a valid community._id for the branches
    }

    // Completely replace existing branches for clean state
    await CommunitySubBranch.deleteMany({ communityId: community._id });

    // Insert new branches
    const branchesToInsert = branches.map((b: any) => ({
      communityDetailsId: community._id,
      branchName: b.branchName,
      address: b.address,
      city: b.city,
      state: b.state,
      country: b.country || 'India',
      phone: b.phone,
    }));

    const insertedBranches = await CommunitySubBranch.insertMany(branchesToInsert);

    // If community has branches and docs, maybe mark profile as completed? 
    // We can just set it here or let an admin do it. For now, we update the status.
    community.isProfileCompleted = true;
    await community.save();

    sendSuccess(res, 200, 'Sub branches updated successfully', { branches: insertedBranches });
  });
}

export const communityController = new CommunityController();
