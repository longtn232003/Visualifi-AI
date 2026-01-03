export interface OAuthProfile {
  googleId?: string;
  facebookId?: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  provider: 'google' | 'facebook';
}
