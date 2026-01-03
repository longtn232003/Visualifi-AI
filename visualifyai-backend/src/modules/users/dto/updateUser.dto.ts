import { IsString, IsOptional, IsEmail, IsEnum, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { PlanType } from 'src/modules/auth/entities/user.entity';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Full name must be a string' })
  @Transform(({ value }: { value: string }) => value?.trim())
  fullName?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email is not valid' })
  @Transform(({ value }: { value: string }) => value?.trim())
  email?: string;

  @IsOptional()
  @IsString({ message: 'Phone number must be a string' })
  @Transform(({ value }: { value: string }) => value?.trim())
  phoneNumber?: string;

  @IsOptional()
  @IsString({ message: 'Address must be a string' })
  @Transform(({ value }: { value: string }) => value?.trim())
  address?: string;

  @IsOptional()
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  @Transform(({ value }: { value: string }) => value?.trim())
  password?: string;

  @IsOptional()
  @IsEnum(PlanType, { message: 'Plan type must be a valid plan type' })
  @Transform(({ value }: { value: string }) => value?.trim())
  planType?: PlanType;
}
