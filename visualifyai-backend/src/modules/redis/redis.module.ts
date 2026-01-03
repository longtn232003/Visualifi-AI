import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { TokenBlacklistService } from './services/tokenBlacklist.service';
import Redis, { Redis as RedisClient } from 'ioredis';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService): RedisClient => {
        return new Redis({
          host: configService.get<string>('REDIS_HOST', '160.30.112.194'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD', '122333aA@'),
        });
      },
      inject: [ConfigService],
    },
    TokenBlacklistService,
  ],
  exports: [TokenBlacklistService],
})
export class RedisModule {}
