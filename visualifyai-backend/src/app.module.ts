import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { V1Module } from './api/v1/v1.module';

@Module({
  imports: [
    // Configure ConfigModule to read environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['production', 'staging', 'development'].includes(process.env.NODE_ENV ?? '')
        ? '.env'
        : '.env.local',
    }),

    // Connect database with TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ isGlobal: true })],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', '122333aA@'),
        database: configService.get('DB_DATABASE', 'visualify-ai-database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV', 'development') !== 'production',
        logging: configService.get('NODE_ENV', 'development') !== 'production',
      }),
    }),

    // Import V1Module
    V1Module,

    // Register application modules
    RouterModule.register([
      {
        path: 'api/v1',
        module: V1Module,
      },
    ]),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
