import { Router } from 'express';
import { communityController } from './community.controller';
import { authenticate, authorize } from '../../../middleware/auth.middleware';

const router = Router();

router.use(authenticate, authorize('COMMUNITY'));

router.get('/profile', communityController.getProfile);
router.post('/change-password', communityController.changePassword);

export default router;
