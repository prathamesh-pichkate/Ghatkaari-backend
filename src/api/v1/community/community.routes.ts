import { Router } from 'express';
import { communityController } from './community.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';
import { upload } from '../../../middleware/upload.middleware';

const router = Router();

router.use(authenticate, authorize('COMMUNITY'));

router.get('/profile', communityController.getProfile);
router.post('/change-password', communityController.changePassword);

// New Profile APIs matching the 3 frontend tabs
router.put(
  '/profile/basic',
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]),
  communityController.updateBasicDetails
);

router.post(
  '/profile/documents',
  upload.fields([
    { name: 'gst_certificate', maxCount: 1 },
    { name: 'pan_card', maxCount: 1 },
    { name: 'incorporation_certificate', maxCount: 1 },
    { name: 'address_proof', maxCount: 1 },
  ]),
  communityController.uploadDocuments
);

router.put('/profile/branches', communityController.updateSubBranches);

export default router;
