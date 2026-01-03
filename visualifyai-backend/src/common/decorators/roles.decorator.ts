import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../../modules/auth/entities/user.entity';

/**
 * Roles decorator key for metadata
 */
export const ROLES_KEY = 'roles';

/**
 * Decorator to specify which roles are allowed to access the endpoint
 *
 * Usage example:
 * @Roles(UserRole.ADMIN)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Get('admin-only')
 * adminOnlyEndpoint() {
 *   return 'Only admin can access this';
 * }
 *
 * @Roles(UserRole.ADMIN, UserRole.USER)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Get('admin-and-user')
 * adminAndUserEndpoint() {
 *   return 'Admin and user can access this';
 * }
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
