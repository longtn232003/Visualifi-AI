import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import { join } from 'path';
import { User } from 'src/modules/auth/entities/user.entity';
import { UploadService } from 'src/modules/upload/service/upload.service';
import { requestApi } from 'src/services/http.service';
import { Between, Repository } from 'typeorm';
import { GenerateInfographicDto } from '../dto/generate-infographic.dto';
import { InfographicResponseDto } from '../dto/infographic-response.dto';
import { InfographicGenerated, ProcessingStatus } from '../entities/infographic-generated.entity';
import { InfographicInput, InputType } from '../entities/infographic-input.entity';

@Injectable()
export class InfographicService {
  constructor(
    @InjectRepository(InfographicInput)
    private readonly infographicInputRepository: Repository<InfographicInput>,
    @InjectRepository(InfographicGenerated)
    private readonly infographicResultRepository: Repository<InfographicGenerated>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Chuyển đổi base64 thành file và trả về path URL
   */
  private saveBase64AsFile(base64Data: string, userId: number): string {
    try {
      // Loại bỏ prefix data:image/...;base64, nếu có
      const base64String = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');

      // Tạo buffer từ base64
      const buffer = Buffer.from(base64String, 'base64');

      // Tạo tên file unique
      const timestamp = Date.now();
      const randomSuffix = Math.round(Math.random() * 1e9);
      const filename = `infographic-${userId}-${timestamp}-${randomSuffix}.png`;

      // Tạo thư mục nếu chưa có
      const uploadDir = join(process.cwd(), 'uploads', 'infographics');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Lưu file
      const filePath = join(uploadDir, filename);
      fs.writeFileSync(filePath, buffer);

      // Trả về URL path
      return this.uploadService.getFileUrl({
        filename,
        subFolder: 'infographics',
      });
    } catch (error) {
      throw new BadRequestException('Không thể lưu file ảnh: ' + error.message);
    }
  }

  async getUserGenerationCountThisMonth(userId: number): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    return await this.infographicResultRepository.count({
      where: {
        userId,
        createdAt: Between(startOfMonth, startOfNextMonth),
      },
    });
  }

  async createInfographic(userId: number, createInfographicDto: GenerateInfographicDto) {
    try {
      const user = await this.userRepository.findOne({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const isPremium = user.isPremiumUser();

      if (!isPremium) {
        const monthlyCount = await this.getUserGenerationCountThisMonth(userId);
        if (monthlyCount >= 2) {
          throw new BadRequestException(
            'You have reached the maximum number of infographic this month.',
          );
        }
      }
      const response = await requestApi<{ image_url: string }>({
        path: '/visualify/user/generate-infographic-text',
        method: 'POST',
        body: {
          message: createInfographicDto.prompt,
          size: createInfographicDto.size,
          style: createInfographicDto.style,
        },
      });

      if (!response.data.image_url) {
        throw new BadRequestException('Failed to generate infographic');
      }

      const input = this.infographicInputRepository.create({
        userId,
        inputType: InputType.TEXT,
        prompt: createInfographicDto.prompt,
        size: createInfographicDto.size,
        style: createInfographicDto.style,
      });

      const savedInput = await this.infographicInputRepository.save(input);

      const imagePath = this.saveBase64AsFile(response.data.image_url, userId);

      const result = this.infographicResultRepository.create({
        userId,
        imagePath: imagePath,
        inputId: savedInput.id,
        status: ProcessingStatus.COMPLETED,
        watermarked: !isPremium,
      });

      const savedResult = await this.infographicResultRepository.save(result);

      return savedResult;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getInfographic(userId: number, id: string): Promise<InfographicResponseDto> {
    const infographicId = parseInt(id);

    if (!infographicId) {
      throw new BadRequestException('Invalid ID');
    }

    const infographic = await this.infographicResultRepository.findOne({
      where: {
        id: infographicId,
        userId,
      },
      relations: ['input'],
    });

    if (!infographic) {
      throw new NotFoundException('Infographic not found');
    }

    return this.mapToInfographicResponseDto(infographic);
  }

  private mapToInfographicResponseDto(infographic: InfographicGenerated): InfographicResponseDto {
    return {
      id: infographic.id,
      prompt: infographic.input?.prompt || '',
      size: infographic.input?.size,
      style: infographic.input?.style,
      status: infographic.status,
      title: '',
      subtitle: '',
      imagePath: infographic.imagePath,
      watermarked: infographic.watermarked,
      createdAt: infographic.createdAt,
      updatedAt: infographic.updatedAt,
    };
  }
}
