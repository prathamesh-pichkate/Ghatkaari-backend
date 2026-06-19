import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  MONGO_URI: z.string(),
  JWT_ACCESS_SECRET: z.string().default('fallback_access_secret'),
  JWT_REFRESH_SECRET: z.string().default('fallback_refresh_secret'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  RESEND_API_KEY: z.string().default('re_fallback'),
});

// Validate environment variables
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables:', _env.error.format());
  process.exit(1);
}

export const env = _env.data;
