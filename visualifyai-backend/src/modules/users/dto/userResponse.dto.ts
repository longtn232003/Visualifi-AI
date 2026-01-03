import { Exclude, Expose } from 'class-transformer';
import { PlanType, UserStatus, UserRole } from '../../auth/entities/user.entity';

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  fullName: string;

  @Expose()
  phoneNumber: string;

  @Expose()
  email: string;

  @Expose()
  address: string;

  @Expose()
  avatar: string;

  @Expose()
  planType: PlanType;

  @Expose()
  status: UserStatus;

  @Expose()
  role: UserRole;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
