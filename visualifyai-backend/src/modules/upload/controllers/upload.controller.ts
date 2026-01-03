import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  testUpload(@UploadedFile() file: Express.Multer.File) {
    console.log('Test upload controller received file:', file);
    return {
      success: true,
      message: 'File received',
      file: file
        ? {
            originalname: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
          }
        : null,
    };
  }

  @Post('/user-avatar')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard)
  uploadUserAvatar(@UploadedFile() file: Express.Multer.File) {
    console.log('Upload avatar controller received file:', file);
    return {
      success: true,
      message: 'File received',
      file: file
        ? {
            originalname: file.originalname,
            filename: file.filename,
            mimetype: file.mimetype,
          }
        : null,
    };
  }
}
