import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { UpdateUserDto } from '../dto/updateUser.dto';
import { ChangePwDto } from 'src/modules/users/dto/changePw.dto';
import { UploadService } from 'src/modules/upload/service/upload.service';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private uploadService: UploadService,
  ) {}

  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Not found user with id: ${id}`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException(`Not found user with email: ${email}`);
    }
    return user;
  }

  async update({
    file,
    userId,
    updateUserDto,
  }: {
    file: Express.Multer.File;
    userId: number;
    updateUserDto: UpdateUserDto;
  }): Promise<IUser> {
    const user = await this.findById(userId);

    const keysAllowEmpty = ['phoneNumber', 'address'];
    const keysAllowUpdate = [
      'fullName',
      'phoneNumber',
      'address',
      'avatarUrl',
      'email',
    ] as (keyof IUser)[];

    Object.keys(updateUserDto).forEach((key) => {
      if (!keysAllowUpdate.includes(key as keyof IUser)) return;

      if (updateUserDto[key] || keysAllowEmpty.includes(key)) {
        user[key] = updateUserDto[key];
      }
    });

    if (file) {
      if (user.avatarUrl) {
        this.uploadService.removeFile({
          fileUrl: user.avatarUrl,
        });
      }

      const fileUrl = this.uploadService.getFileUrl({
        filename: file.filename,
        subFolder: 'user-avatars',
      });

      user.avatarUrl = fileUrl;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...updatedUser } = await this.userRepository.save(user);

    return updatedUser;
  }

  async changePassword(userId: number, changePasswordDto: ChangePwDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    if (currentPassword === newPassword) {
      throw new BadRequestException('New password cannot be the same as the current password');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isPasswordValid = await user.validatePassword(currentPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    try {
      user.password = newPassword;
      user.lastUpdatedPassword = new Date();
      await this.userRepository.save(user);
    } catch {
      throw new InternalServerErrorException('An error occurred while changing password');
    }
  }

  /**
   * Update user role (Admin only)
   * @param adminUserId - ID of admin performing the action
   * @param targetUserId - ID of user whose role will be updated
   * @param role - New role to assign
   */
  async updateUserRole(adminUserId: number, targetUserId: number, role: string): Promise<IUser> {
    // Verify admin permissions
    const adminUser = await this.findById(adminUserId);
    if (!adminUser.isAdmin()) {
      throw new UnauthorizedException('Only admins can update user roles');
    }

    // Find target user
    const targetUser = await this.findById(targetUserId);

    // Update role
    targetUser.role = role as any;

    // Save and return user without password
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...updatedUser } = await this.userRepository.save(targetUser);

    return updatedUser;
  }
}
