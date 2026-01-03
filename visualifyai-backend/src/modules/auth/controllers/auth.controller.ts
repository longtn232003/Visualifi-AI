import { Body, Controller, Get, Headers, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { GetUserInfo } from 'src/common/decorators/get-user.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiResponse } from '../../../common/response/api-response';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { User } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';
import { GoogleOAuthGuard } from '../guards/google-oauth.guard';
import { FacebookOAuthGuard } from '../guards/facebook-oauth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return ApiResponse.created({ data: user, message: 'Create account successfully' });
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { accessToken } = await this.authService.login(loginDto);
    return ApiResponse.success({ data: { accessToken }, message: 'Login successfully' });
  }

  @Post('logout')
  async logout(@Headers() headers: IncomingHttpHeaders) {
    const token = headers.authorization?.split(' ')[1];
    if (!token) {
      return ApiResponse.error({ message: 'Token is required', code: 401 });
    }

    try {
      await this.authService.logout(token);
      return ApiResponse.success({ message: 'Logout successfully', data: null });
    } catch {
      return ApiResponse.success({ message: 'Logout successfully', data: null });
    }
  }

  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const result = await this.authService.forgotPassword(forgotPasswordDto);
    return ApiResponse.success({
      data: null,
      message: result.message,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('reset-password')
  async resetPassword(@GetUserInfo() user: User, @Body() resetPasswordDto: ResetPasswordDto) {
    const result = await this.authService.resetPassword(user, resetPasswordDto);
    return ApiResponse.success({
      data: null,
      message: result.message,
    });
  }

  // Google OAuth endpoints
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth() {
    // redirect to google
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const config = new ConfigService();
    const user = req.user as User;
    const result = this.authService.oauthLogin(user);

    // redirect to frontend with token
    const frontendUrl = config.get('FRONTEND_URL');
    res.redirect(`${frontendUrl}/auth/callback?token=${result.accessToken}&provider=google`);
  }
  // Facebook OAuth endpoints
  @Get('facebook')
  @UseGuards(FacebookOAuthGuard)
  async facebookAuth() {
    // redirect to facebook
  }

  @Get('facebook/callback')
  @UseGuards(FacebookOAuthGuard)
  facebookAuthRedirect(@Req() req: Request, @Res() res: Response) {
    const config = new ConfigService();
    const user = req.user as User;
    const result = this.authService.oauthLogin(user);

    // redirect to frontend with token
    const frontendUrl = config.get('FRONTEND_URL');
    res.redirect(`${frontendUrl}/auth/callback?token=${result.accessToken}&provider=facebook`);
  }
}
