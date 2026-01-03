import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InfographicInput } from './entities/infographic-input.entity';
import { InfographicGenerated } from './entities/infographic-generated.entity';
import { InfographicStorage } from './entities/inphographic-storage.entity';
import { User } from '../auth/entities/user.entity';
import { InfographicController } from './controllers/infographic.controller';
import { InfographicService } from './services/infographic.service';
import { SavedInfographicService } from './services/saved-infographic.service';
import { UserModule } from '../users/user.module';
import { AuthModule } from '../auth/auth.module';
import { UploadModule } from '../upload/upload.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InfographicInput, InfographicGenerated, InfographicStorage, User]),
    UserModule,
    AuthModule,
    UploadModule,
  ],
  controllers: [InfographicController],
  providers: [InfographicService, SavedInfographicService],
  exports: [InfographicService, SavedInfographicService],
})
export class InfographicModule {}
