import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class ListTemplateQueryDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  pageSize?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

export class TemplateListResponseDto {
  id: number;
  title: string;
  description: string;
  category: string;
  imagePath: string;
  createdAt: Date;
  updatedAt: Date;
}

export class TemplateDetailResponseDto {
  id: number;
  title: string;
  description: string;
  category: string;
  imagePath: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CategoryResponseDto {
  name: string;
  count: number;
}
