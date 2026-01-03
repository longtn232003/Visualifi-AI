import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { InfographicSize } from '../entities/infographic-input.entity';
import { InfographicStyle } from '../entities/infographic-input.entity';

export class InfographicToStorageDto {
  @IsNotEmpty()
  @IsNumber()
  @Type(() => Number)
  infographicId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class InfographicStorageResponseDto {
  id: number;
  infographicId: number;
  title: string;
  description: string;
  imagePath: string;
  watermarked: boolean;
  size: InfographicSize;
  style: InfographicStyle;
  prompt: string;
  savedAt: Date;
  updatedAt: Date;
  generatedAt: Date;
}
