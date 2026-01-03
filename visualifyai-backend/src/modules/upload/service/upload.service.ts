import { BadRequestException, Injectable } from '@nestjs/common';
import { extname, join } from 'path';
import * as fs from 'fs';
import { FileUploadOptions } from '../utils/file-upload.utils';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Injectable()
export class UploadService {
  constructor() {}

  /**
   * Get the URL path for a file
   * @param {Object} params - The parameters object
   * @param {string} params.filename - The name of the file
   * @param {string} [params.subFolder] - Optional subfolder where the file is stored
   * @returns {string} The URL path to the file
   */
  getFileUrl({ filename, subFolder }: { filename: string; subFolder?: string }): string {
    const path = subFolder ? `uploads/${subFolder}/${filename}` : `uploads/${filename}`;

    return path;
  }

  /**
   * Remove a file from the uploads directory
   * @param {Object} params - The parameters object
   * @param {string} params.fileUrl - The URL of the file
   * @returns {boolean} True if the file was removed, false otherwise
   */
  removeFile({ fileUrl }: { fileUrl: string }): boolean {
    try {
      const basePath = join(process.cwd(), fileUrl);

      if (fs.existsSync(basePath)) {
        fs.unlinkSync(basePath);
        return true;
      }

      return false;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  customFileInterceptor({
    fieldName = 'file',
    destination = './uploads',
    fileTypes = ['image/jpeg', 'image/png', 'image/jpg'],
    maxSize = 5 * 1024 * 1024,
    generateCustomName,
  }: FileUploadOptions) {
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
          callback(
            new Error(`File type not allowed. Allowed types: ${fileTypes.join(', ')}`),
            false,
          );
        }
      },
      limits: {
        fileSize: maxSize,
      },
    });
  }
}
