import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfographicTemplate } from './entities/infographic-template.entity';
import { InfographicTemplateController } from './controllers/infographic-template.controller';
import { InfographicTemplateService } from './services/infographic-template.service';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [TypeOrmModule.forFeature([InfographicTemplate]), UploadModule],
  controllers: [InfographicTemplateController],
  providers: [InfographicTemplateService],
  exports: [InfographicTemplateService],
})
export class InfographicTemplateModule {}
