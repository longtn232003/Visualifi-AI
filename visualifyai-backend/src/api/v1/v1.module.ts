import { Module } from '@nestjs/common';
import { AuthModule } from 'src/modules/auth/auth.module';
import { AuthController } from 'src/modules/auth/controllers/auth.controller';
import { InfographicController } from 'src/modules/infographic/controllers/infographic.controller';
import { InfographicModule } from 'src/modules/infographic/infographic.module';
import { InfographicTemplateModule } from 'src/modules/infographic-template/infographic-template.module';
import { InfographicTemplateController } from 'src/modules/infographic-template/controllers/infographic-template.controller';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { PaymentController } from 'src/modules/payment/controllers/payment.controller';
import { RedisModule } from 'src/modules/redis/redis.module';
import { UploadController } from 'src/modules/upload/controllers/upload.controller';
import { UploadModule } from 'src/modules/upload/upload.module';
import { UserController } from 'src/modules/users/controller/user.controller';
import { UserModule } from 'src/modules/users/user.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    RedisModule,
    UploadModule,
    InfographicModule,
    InfographicTemplateModule,
    PaymentModule,
  ],
  controllers: [
    AuthController,
    UserController,
    UploadController,
    InfographicController,
    InfographicTemplateController,
    PaymentController,
  ],
})
export class V1Module {}
