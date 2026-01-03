import { Exclude, Expose } from 'class-transformer';
import { PaymentStatus } from '../entities/payment.entity';

export class PaymentResponseDto {
  @Expose()
  id: number;

  @Expose()
  amount: number;

  @Expose()
  billImagePath: string;

  @Expose()
  status: PaymentStatus;

  @Expose()
  adminNote: string;

  @Expose()
  confirmedAt: Date;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  // Hide sensitive information
  @Exclude()
  confirmationToken: string;

  @Exclude()
  userId: number;

  @Exclude()
  confirmedByAdminId: number;

  constructor(partial: Partial<PaymentResponseDto>) {
    Object.assign(this, partial);
  }
}
