import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ParseIntPipe,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { customFileInterceptor } from 'src/common/config/fileInteceptor.config';
import { GetUserInfo } from '../../../common/decorators/get-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { ApiResponse } from '../../../common/response/api-response';
import { User, UserRole } from '../../auth/entities/user.entity';
import { PaymentService } from '../services/payment.service';
import { UploadBillDto } from '../dto/upload-bill.dto';
import { ConfirmPaymentDto } from '../dto/confirm-payment.dto';
import { PaymentStatus } from '../entities/payment.entity';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  /**
   * User uploads bill for payment confirmation
   * POST /payment/upload-bill
   */
  @UseGuards(JwtAuthGuard)
  @Post('upload-bill')
  @UseInterceptors(
    customFileInterceptor({
      fieldName: 'billImage',
      destination: './uploads/payment-bills',
      fileTypes: ['image/jpeg', 'image/png', 'image/jpg'],
      maxSize: 10 * 1024 * 1024, // 10MB
    }),
  )
  async uploadBill(
    @GetUserInfo() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadBillDto: UploadBillDto,
  ) {
    if (!file) {
      throw new BadRequestException('Bill image is required');
    }

    const payment = await this.paymentService.uploadBill(user.id, uploadBillDto, file);

    return ApiResponse.success({
      message: 'Bill uploaded successfully. Admin will review and confirm payment.',
      data: payment,
    });
  }

  /**
   * Get user's payments history
   * GET /payment/my-payments
   */
  @UseGuards(JwtAuthGuard)
  @Get('my-payments')
  async getMyPayments(@GetUserInfo() user: User) {
    const payments = await this.paymentService.getUserPayments(user.id);

    return ApiResponse.success({
      message: 'User payments retrieved successfully',
      data: payments,
    });
  }

  /**
   * Admin: Get payment details by confirmation token
   * GET /payment/confirmation/:token
   */
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('confirmation/:token')
  async getPaymentByToken(@Param('token') token: string) {
    const payment = await this.paymentService.getPaymentByToken(token);

    return ApiResponse.success({
      message: 'Payment details retrieved successfully',
      data: {
        id: payment.id,
        amount: payment.amount,
        billImagePath: payment.billImagePath,
        status: payment.status,
        createdAt: payment.createdAt,
        user: {
          id: payment.user.id,
          fullName: payment.user.fullName,
          email: payment.user.email,
        },
      },
    });
  }

  /**
   * Admin: Confirm or reject payment
   * PUT /payment/confirm/:token
   */
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put('confirm/:token')
  async confirmPayment(
    @Param('token') token: string,
    @GetUserInfo() admin: User,
    @Body() confirmPaymentDto: ConfirmPaymentDto,
  ) {
    const payment = await this.paymentService.confirmPayment(token, admin.id, confirmPaymentDto);

    const statusMessage =
      payment.status === PaymentStatus.CONFIRMED
        ? 'Payment confirmed successfully'
        : 'Payment rejected successfully';

    return ApiResponse.success({
      message: statusMessage,
      data: payment,
    });
  }

  /**
   * Admin: Get all payments with pagination and filtering
   * GET /payment/admin/all
   */
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/all')
  async getAllPayments(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
    @Query('status') status?: PaymentStatus,
  ) {
    const result = await this.paymentService.getAllPayments(page, limit, status);

    return ApiResponse.success({
      message: 'Payments retrieved successfully',
      data: {
        payments: result.payments,
        pagination: {
          currentPage: page,
          totalPages: result.totalPages,
          totalItems: result.total,
          itemsPerPage: limit,
        },
      },
    });
  }

  /**
   * Admin: Get pending payments (quick access)
   * GET /payment/admin/pending
   */
  @Roles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('admin/pending')
  async getPendingPayments(
    @Query('page', ParseIntPipe) page: number = 1,
    @Query('limit', ParseIntPipe) limit: number = 10,
  ) {
    const result = await this.paymentService.getAllPayments(page, limit, PaymentStatus.PENDING);

    return ApiResponse.success({
      message: 'Pending payments retrieved successfully',
      data: {
        payments: result.payments,
        pagination: {
          currentPage: page,
          totalPages: result.totalPages,
          totalItems: result.total,
          itemsPerPage: limit,
        },
      },
    });
  }

  /**
   * Public endpoint: Check payment status by ID (for frontend confirmation page)
   * GET /payment/status/:id
   */
  @Get('status/:id')
  async getPaymentStatus(@Param('id', ParseIntPipe) paymentId: number) {
    // This is a simplified version that doesn't expose sensitive info
    const payments = await this.paymentService.getAllPayments(1, 1000);
    const payment = payments.payments.find((p) => p.id === paymentId);

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return ApiResponse.success({
      message: 'Payment status retrieved successfully',
      data: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        createdAt: payment.createdAt,
        confirmedAt: payment.confirmedAt,
      },
    });
  }
}
