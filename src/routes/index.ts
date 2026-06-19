import { Router, Request, Response } from 'express';
import authRoutes from '../api/v1/auth/auth.routes';
import partnerRoutes from '../api/v1/partner/partner.routes';
import adminRoutes from '../api/v1/admin/admin.routes';
import communityRoutes from '../api/v1/community/community.routes';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: 'Server is healthy' });
});

router.use('/auth', authRoutes);
router.use('/partner', partnerRoutes);
router.use('/admin', adminRoutes);
router.use('/community', communityRoutes);

export default router;
