import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenBlacklistService } from 'src/modules/redis/services/tokenBlacklist.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private tokenBlacklistService: TokenBlacklistService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // First, let PassportStrategy validate the JWT
    const baseCanActivate = await super.canActivate(context);

    if (!baseCanActivate) {
      return false;
    }

    // Then, check if the token is in the blacklist
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    const token: string = authHeader?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Invalid token');
    }

    const isBlacklisted = await this.tokenBlacklistService.isTokenBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token expired or invalid');
    }

    return true;
  }
}
