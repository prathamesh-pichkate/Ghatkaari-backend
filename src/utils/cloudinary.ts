import { v2 as cloudinary } from 'cloudinary';
import { env } from '../config/env';
import { logger } from './logger';

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file buffer directly to Cloudinary via a stream.
 * @param fileBuffer The buffer of the file (from multer memory storage)
 * @param folder The folder path in Cloudinary (e.g. 'community_logos', 'community_docs')
 * @returns The secure URL of the uploaded image/document
 */
export const uploadToCloudinary = (fileBuffer: Buffer, folder: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'auto', // Auto detects image or raw (pdf)
      },
      (error, result) => {
        if (error) {
          logger.error(`Cloudinary upload failed for folder ${folder}`, error);
          return reject(error);
        }
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Cloudinary upload returned undefined result'));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
};
