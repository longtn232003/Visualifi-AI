import { ProcessingStatus } from '../entities/infographic-generated.entity';
import { InfographicSize, InfographicStyle } from '../entities/infographic-input.entity';

export class InfographicResponseDto {
  id: number;
  prompt: string;
  size: InfographicSize;
  style: InfographicStyle;
  status: ProcessingStatus;
  title?: string;
  subtitle?: string;
  imagePath?: string;
  watermarked: boolean;
  createdAt: Date;
  updatedAt: Date;
}
