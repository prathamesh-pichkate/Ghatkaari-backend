import { Router } from 'express';
import { adminController } from './admin.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';

const router = Router();

// All admin routes are protected
router.use(authenticate, authorize('ADMIN'));

router.get('/community/pending', adminController.getPendingRequests);
router.post('/community/approve', adminController.approveCommunity);
router.post('/community/reject', adminController.rejectCommunity);

export default router;
