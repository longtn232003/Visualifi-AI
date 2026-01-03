import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * Data Transfer Object (DTO) for login functionality
 * This class defines the structure of login request data
 */
export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
