import { PlanType, UserStatus, UserRole } from '../../auth/entities/user.entity';

export interface IUser {
  id: number;
  fullName: string;
  phoneNumber?: string;
  email: string;
  address?: string;
  avatar?: string;
  planType: PlanType;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}
