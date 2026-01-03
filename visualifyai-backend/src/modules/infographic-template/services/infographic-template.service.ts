import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InfographicTemplate } from '../entities/infographic-template.entity';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { UploadService } from '../../upload/service/upload.service';
import {
  TemplateListResponseDto,
  CategoryResponseDto,
  TemplateDetailResponseDto,
} from '../dto/list-template.dto';
import { Pagination } from 'src/types/common.type';
import { DEFAULT_PAGE_SIZE } from 'src/constants/common';

@Injectable()
export class InfographicTemplateService {
  constructor(
    @InjectRepository(InfographicTemplate)
    private readonly templateRepository: Repository<InfographicTemplate>,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * Upload templates from files with form data
   */
  async uploadTemplates(
    file: Express.Multer.File,
    formData: CreateTemplateDto,
  ): Promise<InfographicTemplate> {
    if (!file) {
      throw new BadRequestException('Không có file nào được upload');
    }

    const imagePath = this.uploadService.getFileUrl({
      filename: file.filename,
      subFolder: 'infographic-templates',
    });

    const template = this.templateRepository.create({
      title: formData.title,
      description: formData.description ?? '',
      category: formData.category ?? '',
      imagePath,
    });

    const savedTemplate = await this.templateRepository.save(template);

    return savedTemplate;
  }

  async getTemplateList(options?: {
    page?: number;
    pageSize?: number;
    category?: string;
    search?: string;
  }): Promise<{ list: TemplateListResponseDto[]; meta: Pagination }> {
    const page = Math.max(1, options?.page || 1);
    const pageSize = options?.pageSize || DEFAULT_PAGE_SIZE;

    const queryBuilder = this.templateRepository.createQueryBuilder('template');

    if (options?.category) {
      queryBuilder.andWhere('template.category = :category', { category: options.category });
    }

    if (options?.search) {
      queryBuilder.andWhere('(template.title LIKE :search)', {
        search: `%${options.search}%`,
      });
    }

    const totalItem = await queryBuilder.getCount();

    if (totalItem < 1) {
      return {
        list: [],
        meta: { page, pageSize, totalPage: 0, totalItem: 0 },
      };
    }

    const skip = (page - 1) * pageSize;
    const templates = await queryBuilder
      .orderBy('template.createdAt', 'DESC')
      .skip(skip)
      .take(pageSize)
      .getMany();

    const list = templates.map((template) => this.mapToResponseDto(template));
    const totalPage = Math.ceil(totalItem / pageSize);

    return {
      list,
      meta: { page, pageSize, totalPage, totalItem },
    };
  }

  /**
   * Lấy tất cả category với số lượng template trong mỗi category
   */
  async getAllCategories(): Promise<CategoryResponseDto[]> {
    const categories = await this.templateRepository
      .createQueryBuilder('template')
      .select('template.category', 'category')
      .addSelect('COUNT(template.id)', 'count')
      .where('template.category != :empty', { empty: '' })
      .groupBy('template.category')
      .orderBy('count', 'DESC')
      .addOrderBy('template.category', 'ASC')
      .getRawMany();

    return categories.map((item) => ({
      name: item.category,
      count: parseInt(item.count as string),
    }));
  }

  /**
   * Lấy chi tiết template theo ID
   */
  async getTemplateDetail(id: string): Promise<TemplateDetailResponseDto> {
    const templateId = parseInt(id);

    if (!templateId) {
      throw new BadRequestException('Invalid template ID');
    }

    const template = await this.templateRepository.findOne({
      where: { id: templateId },
    });

    if (!template) {
      throw new NotFoundException('Template not found');
    }

    return this.mapToDetailResponseDto(template);
  }

  /**
   * Map entity to response DTO
   */
  private mapToResponseDto(template: InfographicTemplate): TemplateListResponseDto {
    return {
      id: template.id,
      title: template.title,
      description: template.description,
      category: template.category,
      imagePath: template.imagePath,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }

  /**
   * Map entity to detail response DTO
   */
  private mapToDetailResponseDto(template: InfographicTemplate): TemplateDetailResponseDto {
    return {
      id: template.id,
      title: template.title,
      description: template.description,
      category: template.category,
      imagePath: template.imagePath,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    };
  }
}
