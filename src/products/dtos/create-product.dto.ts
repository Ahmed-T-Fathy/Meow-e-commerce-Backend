import { Expose } from 'class-transformer';
import { IsArray, IsDecimal, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from 'src/categories/category.entity';

export class ProductDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @IsDecimal()
  @IsOptional()
  after_discount_price: number;

  @IsArray()
  @IsString({ each: true })
  categories: string[];
}
