import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../modules/auth/entities/user.entity';

/**
 * Custom decorator to extract authenticated user from request
 *
 * Usage example:
 * @Get('profile')
 * @UseGuards(JwtAuthGuard)
 * getProfile(@GetUserInfo() user: User) {
 *   return user;
 * }
 */
export const GetUserInfo = createParamDecorator(
  /**
   * Decorator factory function
   * @param data - Optional parameter data (not used in this case)
   * @param ctx - Execution context containing the request
   * @returns User object attached to the request
   */
  (data: unknown, ctx: ExecutionContext) => {
    // Extract HTTP request object from execution context
    const request = ctx.switchToHttp().getRequest();

    // Return user object that was attached by JWT strategy
    // Type casting to User entity for better type safety
    return request.user as User;
  },
);
