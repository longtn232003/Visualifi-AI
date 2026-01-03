import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { validate } from 'class-validator';
import { TokenBlacklistService } from 'src/modules/redis/services/tokenBlacklist.service';
import { Repository } from 'typeorm';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { User } from '../entities/user.entity';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { OAuthProfile } from '../interfaces/oauth-profile.interface';
import { EmailService } from './email.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private tokenBlacklistService: TokenBlacklistService,
    private emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<Partial<User>> {
    if (!registerDto) {
      throw new BadRequestException('Register data is required');
    }

    const errors = await validate(registerDto);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    const { email } = registerDto;

    // Check if email already exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Create new user
    const user = this.userRepository.create(registerDto);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = await this.userRepository.save(user);

    return userWithoutPassword;
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    // Find user by email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    // Check password
    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Email or password is incorrect');
    }

    // Create JWT payload
    const payload: JwtPayload = { userId: user.id.toString(), email: user.email };

    // Remove password before returning user information
    return { accessToken: this.jwtService.sign(payload) };
  }

  async logout(token: string): Promise<void> {
    // Add token to blacklist
    await this.tokenBlacklistService.addTokenToBlacklist(token);
  }

  async validateUser(payload: JwtPayload): Promise<User | null> {
    return this.userRepository.findOne({ where: { id: parseInt(payload.userId) } });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    // Check if user exists with this email
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('No account found with this email address');
    }
    // Create reset password token with 5 minutes expiry
    const resetPayload = {
      userId: user.id,
      email: user.email,
      type: 'password_reset',
      timestamp: Date.now(),
    };

    const resetToken = await this.jwtService.signAsync(resetPayload, {
      expiresIn: '5m',
      subject: 'password-reset',
      audience: 'visualifyai-users',
    });

    // Send forgot password email
    await this.emailService.sendForgotPasswordEmail(email, resetToken);

    return {
      message: 'If an account with this email exists, a password reset email has been sent',
    };
  }

  async resetPassword(
    user: User,
    resetPasswordDto: ResetPasswordDto,
  ): Promise<{ message: string }> {
    const { newPassword } = resetPasswordDto;

    // Find user in database to ensure user still exists
    const existingUser = await this.userRepository.findOne({ where: { id: user.id } });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    // Check if account is active
    if (!existingUser.isAccountActive()) {
      throw new BadRequestException('Account is not active');
    }

    // Update user password và lastUpdatedPassword
    // Đảm bảo trigger @BeforeUpdate hook bằng cách modify entity trực tiếp
    existingUser.password = newPassword;
    existingUser.lastUpdatedPassword = new Date();

    await this.userRepository.save(existingUser);

    return {
      message: 'Password has been reset successfully',
    };
  }

  async validateOAuthUser(profile: OAuthProfile): Promise<any> {
    let user: User | null = null;

    // Check if user already exists by OAuth ID
    if (profile.provider === 'google' && profile.googleId) {
      user = await this.userRepository.findOne({ where: { googleId: profile.googleId } });
    } else if (profile.provider === 'facebook' && profile.facebookId) {
      user = await this.userRepository.findOne({ where: { facebookId: profile.facebookId } });
    }

    // If user exists with OAuth ID, return that user
    if (user) {
      return user;
    }

    // Check if user exists by email
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email: profile.email },
    });

    if (existingUserByEmail) {
      // Link OAuth account to existing user
      if (profile.provider === 'google' && profile.googleId) {
        existingUserByEmail.googleId = profile.googleId;
      } else if (profile.provider === 'facebook' && profile.facebookId) {
        existingUserByEmail.facebookId = profile.facebookId;
      }

      // Update avatar if not set
      if (!existingUserByEmail.avatarUrl && profile.avatarUrl) {
        existingUserByEmail.avatarUrl = profile.avatarUrl;
      }

      return await this.userRepository.save(existingUserByEmail);
    }

    // Create new user
    const userData = {
      email: profile.email,
      fullName: profile.fullName,
      avatarUrl: profile.avatarUrl,
      provider: profile.provider,
      googleId: profile.provider === 'google' ? profile.googleId : undefined,
      facebookId: profile.provider === 'facebook' ? profile.facebookId : undefined,
      password: undefined, // No password for OAuth users
    };

    const newUser = this.userRepository.create(userData);

    return await this.userRepository.save(newUser);
  }

  oauthLogin(user: User) {
    const payload: JwtPayload = { userId: user.id.toString(), email: user.email };

    // Remove sensitive information
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;

    return {
      accessToken: this.jwtService.sign(payload),
      user: userWithoutPassword,
    };
  }
}
