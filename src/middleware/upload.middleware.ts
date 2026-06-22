import multer from 'multer';
import { AppError } from '../utils/appError';

// We use memory storage because Render has an ephemeral file system.
// We will stream the buffer directly to Cloudinary.
const storage = multer.memoryStorage();

// Filter for Images and PDFs
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new AppError('Invalid file type. Only images and PDFs are allowed.', 400));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
  },
});
