import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { forgotPasswordEmail } from '../../../templates/email/forgot-password';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
      port: this.configService.get<number>('MAIL_PORT', 587),
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('MAIL_USER', 'phamthai4920@gmail.com'),
        pass: this.configService.get<string>('MAIL_PASSWORD', 'xurw jkkr djfz dezr'),
      },
    });
  }

  async sendForgotPasswordEmail(email: string, accessToken?: string): Promise<void> {
    try {
      const mailOptions = {
        from: this.configService.get<string>('MAIL_FROM', 'VisualifyAI <noreply@visualifyai.com>'),
        to: email,
        subject: '<no-reply>VisualifyAI - Đặt lại mật khẩu',
        html: forgotPasswordEmail(accessToken),
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending forgot password email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }
}
