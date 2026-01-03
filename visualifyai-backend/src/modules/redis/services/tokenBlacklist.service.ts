import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';
import Redis from 'ioredis';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @Inject('REDIS_CLIENT') private readonly redisClient: Redis,
    private configService: ConfigService,
  ) {}

  async addTokenToBlacklist(token: string): Promise<void> {
    try {
      // decode token to get the expiration time
      const decoded = jwt.decode(token);
      const JWT_EXPIRES_IN = this.configService.get<string>('JWT_EXPIRES_IN', '1d');

      if (decoded && typeof decoded === 'object' && decoded.exp) {
        // calculate the remaining time (seconds)
        const currentTime = Math.floor(Date.now() / 1000);
        const expiryTime = decoded.exp - currentTime;

        // add to blacklist if the token is not expired
        if (expiryTime > 0) {
          await this.redisClient.set(`bl_${token}`, '1', 'EX', expiryTime);
          console.log(`Token added to blacklist, expires in ${expiryTime} seconds`);
        } else {
          console.log('Token already expired, not adding to blacklist');
        }
      } else {
        // fallback if the token is not decoded
        const expirySeconds = this.getExpirySeconds(JWT_EXPIRES_IN);
        await this.redisClient.set(`bl_${token}`, '1', 'EX', expirySeconds);
        console.log(`Token added to blacklist with default expiry: ${expirySeconds} seconds`);
      }
    } catch (error) {
      console.error('Error blacklisting token:', error);
      // Fallback if there is an error
      const expirySeconds = this.getExpirySeconds(this.configService.get('JWT_EXPIRES_IN', '1d'));
      await this.redisClient.set(`bl_${token}`, '1', 'EX', expirySeconds);
    }
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const exists = await this.redisClient.exists(`bl_${token}`);
    return exists === 1;
  }

  private getExpirySeconds(expiresIn: string): number {
    // Convert from jwt.sign expiresIn format to seconds
    const units = {
      s: 1,
      m: 60,
      h: 60 * 60,
      d: 24 * 60 * 60,
    };

    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (match) {
      const value = parseInt(match[1], 10);
      const unit = match[2] as keyof typeof units;
      return value * units[unit];
    }

    // Default: 1 day
    return 24 * 60 * 60;
  }
}
