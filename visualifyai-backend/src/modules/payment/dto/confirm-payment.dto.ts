import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaymentStatus } from '../entities/payment.entity';

export class ConfirmPaymentDto {
  @IsEnum([PaymentStatus.CONFIRMED, PaymentStatus.REJECTED], {
    message: 'Status must be either confirmed or rejected',
  })
  status: PaymentStatus.CONFIRMED | PaymentStatus.REJECTED;

  @IsOptional()
  @IsString({ message: 'Admin note must be a string' })
  @Transform(({ value }: { value: string }) => value?.trim())
  adminNote?: string;
}
