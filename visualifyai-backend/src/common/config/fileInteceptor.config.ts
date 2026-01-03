import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';

export interface FileUploadOptions {
  fieldName?: string; // Field name for the file (default: 'file')
  destination?: string; // Destination directory (default: './uploads')
  fileTypes?: string[]; // Allowed file types (default: ['image/jpeg', 'image/png', 'image/jpg'])
  maxSize?: number; // Maximum file size in bytes (default: 5MB)
  generateCustomName?: (originalname: string) => string; // Custom function to generate filename
}

export interface MultiFileUploadOptions extends FileUploadOptions {
  maxCount?: number; // Maximum number of files (default: 10)
}

/**
 * Create a custom FileInterceptor to handle single file upload
 * @returns Configured FileInterceptor
 */
export const customFileInterceptor = ({
  fieldName = 'file',
  destination = './uploads',
  fileTypes = ['image/jpeg', 'image/png', 'image/jpg'],
  maxSize = 5 * 1024 * 1024,
  generateCustomName,
}: FileUploadOptions) => {
  // Set default values

  // Ensure the destination directory exists
  const uploadPath = destination.startsWith('./')
    ? join(process.cwd(), destination.slice(2))
    : destination;

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return FileInterceptor(fieldName, {
    storage: diskStorage({
      destination: (req, file, callback) => {
        callback(null, uploadPath);
      },
      filename: (req, file, callback) => {
        // Use custom name function if provided
        if (generateCustomName) {
          const customName = generateCustomName(file.originalname);
          return callback(null, customName);
        }

        // Default filename method
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      // Check file type
      if (fileTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        console.log(`Rejected file: ${file.originalname}, invalid type: ${file.mimetype}`);
        callback(new Error(`File type not allowed. Allowed types: ${fileTypes.join(', ')}`), false);
      }
    },
    limits: {
      fileSize: maxSize,
    },
  });
};

/**
 * Create a custom FilesInterceptor to handle multiple files upload
 * @returns Configured FilesInterceptor
 */
export const customFilesInterceptor = ({
  fieldName = 'files',
  destination = './uploads',
  fileTypes = ['image/jpeg', 'image/png', 'image/jpg'],
  maxSize = 5 * 1024 * 1024,
  maxCount = 10,
  generateCustomName,
}: MultiFileUploadOptions) => {
  // Ensure the destination directory exists
  const uploadPath = destination.startsWith('./')
    ? join(process.cwd(), destination.slice(2))
    : destination;

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  return FilesInterceptor(fieldName, maxCount, {
    storage: diskStorage({
      destination: (req, file, callback) => {
        callback(null, uploadPath);
      },
      filename: (req, file, callback) => {
        // Use custom name function if provided
        if (generateCustomName) {
          const customName = generateCustomName(file.originalname);
          return callback(null, customName);
        }

        // Default filename method
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        const filename = `${uniqueSuffix}${ext}`;
        callback(null, filename);
      },
    }),
    fileFilter: (req, file, callback) => {
      // Check file type
      if (fileTypes.includes(file.mimetype)) {
        callback(null, true);
      } else {
        console.log(`Rejected file: ${file.originalname}, invalid type: ${file.mimetype}`);
        callback(new Error(`File type not allowed. Allowed types: ${fileTypes.join(', ')}`), false);
      }
    },
    limits: {
      fileSize: maxSize,
    },
  });
};
