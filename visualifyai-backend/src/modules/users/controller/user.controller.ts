import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { customFileInterceptor } from 'src/common/config/fileInteceptor.config';
import { GetUserInfo } from '../../../common/decorators/get-user.decorator';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiResponse } from '../../../common/response/api-response';
import { User } from '../../auth/entities/user.entity';
import { ChangePwDto } from '../dto/changePw.dto';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { UserService } from '../services/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@GetUserInfo() user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user;
    return ApiResponse.success({
      data: userWithoutPassword,
      message: 'Get profile successfully',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePwDto, @GetUserInfo() user: User) {
    await this.userService.changePassword(user.id, changePasswordDto);
    return ApiResponse.success({ message: 'Password changed successfully', data: null });
  }

  @Put('update')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    customFileInterceptor({
      fieldName: 'avatar',
      destination: './uploads/user-avatars',
      fileTypes: ['image/jpeg', 'image/png', 'image/jpg'],
      maxSize: 5 * 1024 * 1024,
    }),
  )
  async updateUser(
    @GetUserInfo() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UpdateUserDto,
  ) {
    const updatedUser = await this.userService.update({
      file,
      userId: user.id,
      updateUserDto: body,
    });
    return ApiResponse.success({
      message: 'Update user successfully',
      data: { ...updatedUser },
    });
  }
}
