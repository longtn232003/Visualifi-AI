import { Module } from '@nestjs/common';
import { UploadService } from './service/upload.service';
import { UploadController } from './controllers/upload.controller';
import { multerConfig } from 'src/common/config/multer.config';
import { MulterModule } from '@nestjs/platform-express';

/**
 * Upload Module - Handles file upload functionality
 */
@Module({
  imports: [MulterModule.register(multerConfig('./uploads/user'))],
  providers: [
    {
      provide: 'UPLOAD_MODULE_INIT',
      useFactory: () => {
        console.log('UploadModule initialized!');
        return true;
      },
    },
    UploadService,
  ],
  controllers: [UploadController],
  exports: [UploadService],
})
export class UploadModule {}
