import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { transformerOrderBy } from '../../transformers/transform-orderby.transformer';
import { Orders_Status } from '../order-status';

export class OrdersPaginationDTO{
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
    @IsEnum(Orders_Status)
    status?: string;
  
    @IsOptional()
    @IsUUID()
    user?: string;

}