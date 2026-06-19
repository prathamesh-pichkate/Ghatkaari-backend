import app from './app';
import { env } from './config/env';
import { connectDB } from './config/db';
import { connectRedis } from './config/redis';
import { logger } from './utils/logger';

const PORT = env.PORT || 5000;

// Connect to Database and Redis
connectDB();
connectRedis();

const server = app.listen(PORT, () => {
  logger.info(`Server is running in ${env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error, promise) => {
  logger.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
