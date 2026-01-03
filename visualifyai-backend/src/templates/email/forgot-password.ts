import { ConfigService } from '@nestjs/config';

export const forgotPasswordEmail = (accessToken?: string) => {
  const configService = new ConfigService();
  const frontendUrl = configService.get<string>('FRONTEND_URL', 'http://localhost:4200');

  return `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #333;">Yêu cầu đặt lại mật khẩu</h2>
  <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
  <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
  ${accessToken ? `<a href="${frontendUrl}/reset-password/${accessToken}">Đặt lại mật khẩu</a>` : ''}
  <p style="color: #666; font-size: 12px;">Email này được gửi tự động, vui lòng không phản hồi.</p>
  <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
  <p style="color: #999; font-size: 12px;">© 2024 VisualifyAI. All rights reserved.</p>
</div>`;
};
