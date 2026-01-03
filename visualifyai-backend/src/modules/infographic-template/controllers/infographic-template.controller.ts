import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Get,
  Query,
  Param,
} from '@nestjs/common';
import { customFileInterceptor } from 'src/common/config/fileInteceptor.config';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { ApiResponse } from 'src/common/response/api-response';
import { CreateTemplateDto } from '../dto/create-template.dto';
import { ListTemplateQueryDto } from '../dto/list-template.dto';
import { InfographicTemplateService } from '../services/infographic-template.service';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from 'src/modules/auth/entities/user.entity';
import { RolesGuard } from 'src/common/guards/roles.guard';
@Controller('infographic-template')
export class InfographicTemplateController {
  constructor(private readonly templateService: InfographicTemplateService) {}

  /**
   * Upload templates with form data
   */
  @Post('upload')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @UseInterceptors(
    customFileInterceptor({
      fieldName: 'images',
      destination: './uploads/infographic-templates',
      fileTypes: ['image/jpeg', 'image/png', 'image/jpg'],
      maxSize: 10 * 1024 * 1024, // 10MB
    }),
  )
  async uploadTemplates(
    @UploadedFile() file: Express.Multer.File,
    @Body() formData: CreateTemplateDto,
  ) {
    const templates = await this.templateService.uploadTemplates(file, formData);

    return ApiResponse.created({
      data: templates,
      message: 'Upload template infographic success',
    });
  }

  @Get('list')
  async getTemplateList(@Query() query: ListTemplateQueryDto) {
    const result = await this.templateService.getTemplateList({
      page: query.page ? parseInt(query.page) : undefined,
      pageSize: query.pageSize ? parseInt(query.pageSize) : undefined,
      category: query.category,
      search: query.search,
    });

    return ApiResponse.success({
      data: result,
      message: 'Get template infographic list success',
    });
  }

  /**
   * Get all categories
   */
  @Get('categories-list')
  async getAllCategories() {
    const categories = await this.templateService.getAllCategories();

    return ApiResponse.success({
      data: categories,
      message: 'Get all categories success',
    });
  }

  /**
   * Get template detail by ID
   */
  @Get(':id')
  async getTemplateDetail(@Param('id') id: string) {
    const template = await this.templateService.getTemplateDetail(id);

    return ApiResponse.success({
      data: template,
      message: 'Get template detail success',
    });
  }
}
