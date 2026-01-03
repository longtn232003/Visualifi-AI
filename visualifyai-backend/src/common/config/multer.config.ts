import { diskStorage } from 'multer';
import { extname } from 'path';

/**
 * Multer configuration for file uploads
 * This configuration can be reused across different modules
 */
export const multerConfig = (destination: string = './uploads') => ({
  storage: diskStorage({
    destination: (req, file, callback) => {
      callback(null, destination);
    },
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;
      callback(null, filename);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB
  },
  fileFilter: (req, file, callback) => {
    callback(null, true);
  },
});

/**
 * Multer configuration with custom destination
 * @param destination - Custom upload destination path
 */
export const createMulterConfig = (destination: string = './uploads') => ({
  storage: diskStorage({
    destination: (req, file, callback) => {
      console.log('MULTER DESTINATION called for file:', file.originalname);
      callback(null, destination);
    },
    filename: (req, file, callback) => {
      console.log('MULTER FILENAME called for file:', file.originalname);
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const filename = `${uniqueSuffix}${ext}`;
      console.log('Generated filename:', filename);
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    console.log(
      `MULTER FILEFILTER called for file: ${file.originalname}, mimetype: ${file.mimetype}`,
    );
    callback(null, true);
  },
});
