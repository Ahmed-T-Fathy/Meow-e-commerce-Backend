import { IsNumber, IsString, IsUUID } from 'class-validator';
import { Product } from 'src/products/product.entity';

export class CreateProductVariantDTO {
  @IsString()
  size: string;

  @IsString()
  @IsUUID()
  color: string;

  @IsNumber()
  stock: number;

  @IsString()
  @IsUUID()
  product: string;
}
