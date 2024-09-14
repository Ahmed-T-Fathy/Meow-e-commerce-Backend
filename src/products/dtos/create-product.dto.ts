import { Expose } from 'class-transformer';
import { IsArray, IsDecimal, IsNotEmpty, IsOptional, IsString, IsUUID ,ValidatorConstraint} from 'class-validator';
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

  @IsDecimal()
  @IsNotEmpty()
  price: number;

  @IsDecimal()
  @IsOptional()
  after_discount_price: number;

  @IsArray()
  @IsString({ each: true })
  @IsUUID('4',{each:true})
  categories: string[];
}
