import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InfographicStorageResponseDto,
  InfographicToStorageDto,
} from '../dto/infographic-to-storage.dto';
import { UpdateSavedInfographicDto } from '../dto/update-saved-infographic.dto';
import { InfographicGenerated } from '../entities/infographic-generated.entity';
import { InfographicStorage } from '../entities/inphographic-storage.entity';
import { Pagination } from 'src/types/common.type';
import { DEFAULT_PAGE_SIZE } from 'src/constants/common';

@Injectable()
export class SavedInfographicService {
  constructor(
    @InjectRepository(InfographicStorage)
    private readonly savedInfographicRepository: Repository<InfographicStorage>,
    @InjectRepository(InfographicGenerated)
    private readonly infographicGeneratedRepository: Repository<InfographicGenerated>,
  ) {}

  async saveInfographicToStorage(
    userId: number,
    infographicToStorageDto: InfographicToStorageDto,
  ): Promise<InfographicStorageResponseDto> {
    try {
      const infographic = await this.infographicGeneratedRepository.findOne({
        where: {
          id: infographicToStorageDto.infographicId,
          userId,
        },
        relations: ['input'],
      });

      if (!infographic) {
        throw new NotFoundException('Infographic không tồn tại hoặc không thuộc về bạn');
      }

      const existingSaved = await this.savedInfographicRepository.findOne({
        where: {
          userId,
          infographicId: infographicToStorageDto.infographicId,
        },
      });

      if (existingSaved) {
        throw new BadRequestException('Infographic này đã được lưu vào kho cá nhân rồi');
      }

      const savedInfographic = this.savedInfographicRepository.create({
        userId,
        infographicId: infographicToStorageDto.infographicId,
        title: infographicToStorageDto.title,
        description: infographicToStorageDto.description,
      });

      const saved = await this.savedInfographicRepository.save(savedInfographic);

      return this.mapToResponseDto(saved, infographic);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async getUserSavedInfographics(
    userId: number,
    options?: {
      page?: number;
      pageSize?: number;
    },
  ): Promise<{ list: InfographicStorageResponseDto[]; meta: Pagination }> {
    try {
      const page = Math.max(1, options?.page || 1);
      const pageSize = options?.pageSize || DEFAULT_PAGE_SIZE;

      const baseCondition = 'saved.userId = :userId AND infographic.id IS NOT NULL';
      const parameters = { userId };

      const totalItem = await this.savedInfographicRepository
        .createQueryBuilder('saved')
        .where('saved.userId = :userId', { userId })
        .getCount();

      if (totalItem < 1) {
        return {
          list: [],
          meta: { page, pageSize, totalPage: 0, totalItem: 0 },
        };
      }

      const skip = (page - 1) * pageSize;
      const savedInfographics = await this.savedInfographicRepository
        .createQueryBuilder('saved')
        .innerJoinAndSelect('saved.infographic', 'infographic')
        .leftJoinAndSelect('infographic.input', 'input')
        .where(baseCondition, parameters)
        .orderBy('saved.createdAt', 'DESC')
        .skip(skip)
        .take(pageSize)
        .getMany();

      const list = savedInfographics.map((saved) =>
        this.mapToResponseDto(saved, saved.infographic),
      );
      const totalPage = Math.ceil(totalItem / pageSize);

      return {
        list,
        meta: { page, pageSize, totalPage, totalItem },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async updateSavedInfographic(
    id: number,
    userId: number,
    updateDto: UpdateSavedInfographicDto,
  ): Promise<InfographicStorageResponseDto> {
    try {
      const saved = await this.savedInfographicRepository.findOne({
        where: { id, userId },
        relations: ['infographic', 'infographic.input'],
      });

      if (!saved) {
        throw new NotFoundException('Infographic đã lưu không tồn tại');
      }

      if (updateDto.title !== undefined) {
        saved.title = updateDto.title;
      }
      if (updateDto.description !== undefined) {
        saved.description = updateDto.description;
      }

      const updated = await this.savedInfographicRepository.save(saved);

      return this.mapToResponseDto(updated, updated.infographic);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async deleteUserSavedInfographics(userId: number, id: string) {
    try {
      // Validate và convert id string sang number
      const savedInfographicId = parseInt(id);

      if (!savedInfographicId) {
        throw new BadRequestException('ID not valid');
      }

      const saved = await this.savedInfographicRepository.findOne({
        where: {
          id: savedInfographicId,
          userId,
        },
        relations: ['infographic'],
      });

      if (!saved) {
        throw new NotFoundException('Infographic not found or not belong to you');
      }

      // Delete infographic from storage
      await this.savedInfographicRepository.remove(saved);

      return true;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponseDto(
    saved: InfographicStorage,
    infographic: InfographicGenerated,
  ): InfographicStorageResponseDto {
    return {
      id: saved.id,
      infographicId: saved.infographicId,
      title: saved.title,
      description: saved.description,
      imagePath: infographic.imagePath,
      watermarked: infographic.watermarked,
      size: infographic.input?.size,
      style: infographic.input?.style,
      prompt: infographic.input?.prompt,
      savedAt: saved.createdAt,
      updatedAt: saved.updatedAt,
      generatedAt: infographic.createdAt,
    };
  }
}
