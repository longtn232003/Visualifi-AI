import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { InfographicSize, InfographicStyle } from '../entities/infographic-input.entity';

export class GenerateInfographicDto {
  @IsNotEmpty()
  @IsString()
  prompt: string;

  @IsEnum(InfographicSize)
  @IsOptional()
  size?: InfographicSize = InfographicSize.SIZE_11;

  @IsEnum(InfographicStyle)
  @IsOptional()
  style?: InfographicStyle = InfographicStyle.SIMPLE;
}
