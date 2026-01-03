import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../services/auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

/**
 * JWT Strategy for handling JWT authentication
 * Extends PassportStrategy and uses JWT Strategy from passport-jwt
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService, //read config from .env
    private authService: AuthService, // Service handle authentication
  ) {
    /**
     * Configure JWT Strategy options
     * @param jwtFromRequest - Determine how to get token from request (Bearer token)
     * @param ignoreExpiration - false: will check token expiration
     * @param secretOrKey - Secret key to verify JWT token
     */
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'yoursecretkey',
    });
  }

  /**
   * Validate JWT payload and return user
   * This method is automatically called by Passport after JWT is verified
   *
   * @param payload - JWT payload that has been decoded
   * @returns User object will be assigned to request.user
   * @throws UnauthorizedException if user does not exist
   */
  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      throw new UnauthorizedException('User does not exist or does not have access');
    }
    return user; // Automatically assigned to request.user by Passport
  }
}
