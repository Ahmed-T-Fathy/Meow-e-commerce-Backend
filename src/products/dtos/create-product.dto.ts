import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDecimal,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidatorConstraint,
} from 'class-validator';
import { Category } from 'src/categories/category.entity';

export class CreateProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  short_description: string;

  @Type(() => Number)
  @IsNumber({}, { message: 'price must be a valid number' })
  @Min(1)
  @IsNotEmpty()
  price: number;

  @IsNumber({}, { message: 'after_discount_price must be a valid number' })
  @Min(1)
  @IsOptional()
  after_discount_price: number;

  @IsArray()
  @IsString({ each: true })
  @IsUUID('4', { each: true })
  categories: string[];
}
