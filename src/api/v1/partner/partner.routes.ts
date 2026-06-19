import { Router } from 'express';
import { partnerController } from './partner.controller';

const router = Router();

router.post('/request', partnerController.createRequest);
router.get('/status/:id', partnerController.getStatus);

export default router;
