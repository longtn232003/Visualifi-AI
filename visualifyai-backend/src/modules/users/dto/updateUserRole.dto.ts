import { IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserRole } from 'src/modules/auth/entities/user.entity';

export class UpdateUserRoleDto {
  @IsEnum(UserRole, { message: 'Role must be either user or admin' })
  @Transform(({ value }: { value: string }) => value?.trim())
  role: UserRole;
}
