import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../../middleware/validate';
import { signupSchema, loginSchema, verifyOtpSchema, sendEmailOtpSchema, sendMobileOtpSchema } from './auth.validation';
import { authenticate } from '../../../middleware/auth.middleware';

const router = Router();

// 1. Send OTPs
router.post('/send-email-otp', validate(sendEmailOtpSchema), authController.sendEmailOtp);
router.post('/send-mobile-otp', validate(sendMobileOtpSchema), authController.sendMobileOtp);

// 2. Verify OTPs
router.post('/verify-email-otp', validate(verifyOtpSchema), authController.verifyEmailOtp);
router.post('/verify-mobile-otp', validate(verifyOtpSchema), authController.verifyMobileOtp);

// 3. Signup & Login
router.post('/signup', validate(signupSchema), authController.signup);
router.post('/login', validate(loginSchema), authController.login);

// Authenticated routes
router.post('/logout', authenticate, authController.logout);
router.get('/profile', authenticate, authController.profile);

export default router;
