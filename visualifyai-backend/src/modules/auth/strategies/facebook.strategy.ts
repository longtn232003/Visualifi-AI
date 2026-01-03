import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';

// Import Facebook strategy with types
import * as FacebookPassport from 'passport-facebook';

@Injectable()
export class FacebookStrategy extends PassportStrategy(FacebookPassport.Strategy, 'facebook') {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('FACEBOOK_APP_ID') || '',
      clientSecret: configService.get<string>('FACEBOOK_APP_SECRET') || '',
      callbackURL: configService.get<string>('FACEBOOK_CALLBACK_URL') || '',
      scope: 'email',
      profileFields: ['emails', 'name', 'picture.type(large)'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: any): Promise<any> {
    const { id, name, emails, photos } = profile;

    const userProfile = {
      facebookId: id,
      email: emails && emails[0] ? emails[0].value : null,
      fullName: `${name.givenName} ${name.familyName}`,
      avatarUrl: photos && photos[0] ? photos[0].value : null,
      provider: 'facebook' as const,
    };

    const user = await this.authService.validateOAuthUser(userProfile);
    done(null, user);
  }
}
