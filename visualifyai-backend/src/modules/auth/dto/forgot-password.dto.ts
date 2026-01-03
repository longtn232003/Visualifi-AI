import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object (DTO) for forgot password functionality
 * This class defines the structure of forgot password request data
 */
export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;
}
