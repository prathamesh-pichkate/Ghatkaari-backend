import { Resend } from 'resend';
import { env } from '../config/env';
import { logger } from './logger';

const resend = new Resend(env.RESEND_API_KEY);

// For Resend's free tier/testing, you MUST use this exact email address as the sender.
const FROM_EMAIL = 'onboarding@resend.dev';

export const sendEmailVerificationOTP = async (to: string, otp: string) => {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: 'Verify your Email - Ghatkaari',
      html: `<h1>Email Verification</h1><p>Your OTP is: <strong>${otp}</strong></p><p>This OTP will expire in 5 minutes.</p>`,
    });

    if (error) {
      logger.error('Resend API Error:', error);
      return;
    }

    logger.info(`[MOCK EMAIL] OTP for ${to} is ${otp}`); // Helpful for local testing
  } catch (error) {
    logger.error('Failed to send email verification OTP', error);
  }
};

export const sendCommunityCredentials = async (to: string, communityName: string, password: string) => {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Welcome to Ghatkaari, ${communityName}!`,
      html: `<h1>Your Account is Approved</h1>
             <p>Welcome to Ghatkaari. Here are your temporary login credentials:</p>
             <p>Email: ${to}</p>
             <p>Password: <strong>${password}</strong></p>
             <p>Please change your password immediately after logging in.</p>`,
    });
  } catch (error) {
    logger.error('Failed to send community credentials', error);
  }
};
