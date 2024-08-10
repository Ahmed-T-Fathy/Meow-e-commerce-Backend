import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { transformerOrderBy } from '../../transformers/transform-orderby.transformer';

export class VariantsPaginationDTO {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @Transform(transformerOrderBy)
  orderBy?: [{ field: string; direction: 'ASC' | 'DESC' }];

  @IsOptional()
  @IsUUID()
  color?: string;

  @IsOptional()
  @IsUUID()
  product?: string;
  
  @IsOptional()
  @IsUUID()
  size?: string;
}
