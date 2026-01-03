import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as nodemailer from 'nodemailer';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { User } from '../../auth/entities/user.entity';
import { UploadBillDto } from '../dto/upload-bill.dto';
import { ConfirmPaymentDto } from '../dto/confirm-payment.dto';
import { PaymentResponseDto } from '../dto/payment-response.dto';
import { EmailService } from '../../auth/services/email.service';
import { UploadService } from '../../upload/service/upload.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private emailService: EmailService,
    private uploadService: UploadService,
    private configService: ConfigService,
  ) {}

  /**
   * User uploads bill for payment confirmation
   */
  async uploadBill(
    userId: number,
    uploadBillDto: UploadBillDto,
    billFile: Express.Multer.File,
  ): Promise<PaymentResponseDto> {
    try {
      // Check if user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Generate unique confirmation token
      const confirmationToken = uuidv4();

      // Get bill image URL
      const billImagePath = this.uploadService.getFileUrl({
        filename: billFile.filename,
        subFolder: 'payment-bills',
      });

      // Create payment record
      const payment = this.paymentRepository.create({
        userId,
        amount: Number(uploadBillDto.amount),
        billImagePath,
        confirmationToken,
      });

      const savedPayment = await this.paymentRepository.save(payment);

      // Send email to admin
      await this.sendAdminNotificationEmail(savedPayment, user);

      return new PaymentResponseDto(savedPayment);
    } catch (error) {
      // Remove uploaded file if payment creation fails
      if (billFile) {
        this.uploadService.removeFile({
          fileUrl: billFile.filename,
        });
      }
      throw error;
    }
  }

  /**
   * Get payment by confirmation token for admin
   */
  async getPaymentByToken(token: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { confirmationToken: token },
      relations: ['user'],
    });

    if (!payment) {
      throw new NotFoundException('Payment not found or invalid token');
    }

    return payment;
  }

  /**
   * Admin confirms or rejects payment
   */
  async confirmPayment(
    token: string,
    adminUserId: number,
    confirmPaymentDto: ConfirmPaymentDto,
  ): Promise<PaymentResponseDto> {
    // Get payment by token
    const payment = await this.getPaymentByToken(token);

    // Check if payment is still pending
    if (!payment.isPending()) {
      throw new BadRequestException(`Payment has already been ${payment.status}`);
    }

    // Verify admin exists
    const admin = await this.userRepository.findOne({ where: { id: adminUserId } });
    if (!admin || !admin.isAdmin()) {
      throw new BadRequestException('Only admins can confirm payments');
    }

    // Update payment
    payment.status = confirmPaymentDto.status;
    payment.confirmedByAdminId = adminUserId;
    payment.confirmedAt = new Date();
    payment.adminNote = confirmPaymentDto.adminNote || '';

    const updatedPayment = await this.paymentRepository.save(payment);

    // Send confirmation email to user
    await this.sendUserConfirmationEmail(updatedPayment);

    // TODO: Add callback logic here if needed
    if (payment.isConfirmed()) {
      await this.handlePaymentConfirmed(updatedPayment);
    }

    return new PaymentResponseDto(updatedPayment);
  }

  /**
   * Get all payments (admin only)
   */
  async getAllPayments(
    page: number = 1,
    limit: number = 10,
    status?: PaymentStatus,
  ): Promise<{ payments: PaymentResponseDto[]; total: number; totalPages: number }> {
    const whereCondition = status ? { status } : {};

    const [payments, total] = await this.paymentRepository.findAndCount({
      where: whereCondition,
      relations: ['user', 'confirmedByAdmin'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const totalPages = Math.ceil(total / limit);

    return {
      payments: payments.map((payment) => new PaymentResponseDto(payment)),
      total,
      totalPages,
    };
  }

  /**
   * Get user's payments
   */
  async getUserPayments(userId: number): Promise<PaymentResponseDto[]> {
    const payments = await this.paymentRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    return payments.map((payment) => new PaymentResponseDto(payment));
  }

  /**
   * Send email notification to admin
   */
  private async sendAdminNotificationEmail(payment: Payment, user: User): Promise<void> {
    try {
      const confirmationUrl = `${this.configService.get('FRONTEND_URL', 'http://localhost:3000')}/admin/payment-confirmation?token=${payment.confirmationToken}`;

      const emailContent = `
        <h2>New Payment Bill Uploaded</h2>
        <p><strong>User:</strong> ${user.fullName} (${user.email})</p>
        <p><strong>Amount:</strong> $${payment.amount}</p>
        <p><strong>Bill Image:</strong> <a href="${payment.billImagePath}">View Bill</a></p>

        <p><a href="${confirmationUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px;">
          Click here to confirm payment
        </a></p>
      `;

      await this.sendCustomEmail(
        this.configService.get('ADMIN_EMAIL', 'pkamthai2k@gmail.com'),
        'New Payment Bill Uploaded - Confirmation Required',
        emailContent,
      );
    } catch (error) {
      console.error('Failed to send admin notification email:', error);
      // Don't throw error here to avoid breaking the payment upload flow
    }
  }

  /**
   * Send confirmation email to user
   */
  private async sendUserConfirmationEmail(payment: Payment): Promise<void> {
    try {
      const user = await this.userRepository.findOne({ where: { id: payment.userId } });
      if (!user) return;

      const statusMessage = payment.isConfirmed()
        ? 'Your payment has been confirmed!'
        : 'Your payment has been rejected.';

      const emailContent = `
        <h2>Payment Status Update</h2>
        <p>Dear ${user.fullName},</p>
        <p>${statusMessage}</p>
        <p><strong>Amount:</strong> $${payment.amount}</p>
        <p><strong>Status:</strong> ${payment.status}</p>
        ${payment.adminNote ? `<p><strong>Admin Note:</strong> ${payment.adminNote}</p>` : ''}
        <p>Thank you for using our service!</p>
      `;

      await this.sendCustomEmail(
        user.email,
        `Payment ${payment.status} - VisualifyAI`,
        emailContent,
      );
    } catch (error) {
      console.error('Failed to send user confirmation email:', error);
    }
  }

  /**
   * Send custom email using existing EmailService infrastructure
   */
  private async sendCustomEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      // We'll use the nodemailer transporter from EmailService
      const transporter = nodemailer.createTransport({
        host: this.configService.get<string>('MAIL_HOST', 'smtp.gmail.com'),
        port: this.configService.get<number>('MAIL_PORT', 587),
        secure: false,
        auth: {
          user: this.configService.get<string>('MAIL_USER'),
          pass: this.configService.get<string>('MAIL_PASSWORD'),
        },
      });

      const mailOptions = {
        from: this.configService.get<string>('MAIL_FROM', 'VisualifyAI <noreply@visualifyai.com>'),
        to,
        subject,
        html,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new InternalServerErrorException('Failed to send email');
    }
  }

  /**
   * Handle confirmed payment callback logic
   */
  private async handlePaymentConfirmed(payment: Payment): Promise<void> {
    try {
      // TODO: Add your callback logic here
      // For example:
      // - Update user's plan type
      // - Grant access to premium features
      // - Log the transaction
      // - Update billing records

      await Promise.resolve(); // Placeholder to satisfy async requirement
      console.log(`Payment ${payment.id} confirmed. Processing callback...`);

      // Example: Update user plan if payment is for subscription
      // const user = await this.userRepository.findOne({ where: { id: payment.userId } });
      // if (user && payment.amount >= 29.99) {
      //   user.planType = PlanType.PRO;
      //   await this.userRepository.save(user);
      // }
    } catch (error) {
      console.error('Error in payment confirmation callback:', error);
      throw new InternalServerErrorException('Payment confirmed but callback failed');
    }
  }
}
