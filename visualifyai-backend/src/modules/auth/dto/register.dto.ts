import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

/**
 * Data Transfer Object (DTO) for registration functionality
 * This class defines the structure of registration request data
 */
export class RegisterDto {
  @IsEmail({}, { message: 'Email is not valid' })
  @IsNotEmpty({ message: 'Email is required' })
  @Transform(({ value }: { value: string }) => (value ?? '').toLowerCase().trim())
  email: string;

  @IsString({ message: 'Full name must be a string' })
  @IsNotEmpty({ message: 'Full name is required' })
  @Transform(({ value }: { value: string }) => (value ?? '').toLowerCase().trim())
  fullName: string;

  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Transform(({ value }: { value: string }) => (value ?? '').toLowerCase().trim())
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
