import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../modules/auth/entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { User } from '../../modules/auth/entities/user.entity';

/**
 * Guard to check if user has required roles to access the endpoint
 *
 * Usage:
 * @Roles(UserRole.ADMIN)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Get('admin-only')
 * adminOnlyEndpoint() {
 *   return 'Only admin can access this';
 * }
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles from decorator metadata
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are specified, allow access
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Get user from request
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;

    // Check if user exists
    if (!user) {
      throw new ForbiddenException(
        'User not found in request. Make sure JwtAuthGuard is applied before RolesGuard.',
      );
    }

    // Check if user has any of the required roles
    const hasRole = requiredRoles.some((role) => user.role === role);

    if (!hasRole) {
      throw new ForbiddenException(`Access denied`);
    }

    return true;
  }
}
