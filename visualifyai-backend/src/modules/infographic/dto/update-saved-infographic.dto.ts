import { IsOptional, IsString } from 'class-validator';

export class UpdateSavedInfographicDto {
  /**
   * Tiêu đề tùy chỉnh (tùy chọn)
   */
  @IsOptional()
  @IsString()
  title?: string;

  /**
   * Mô tả/ghi chú (tùy chọn)
   */
  @IsOptional()
  @IsString()
  description?: string;
}
