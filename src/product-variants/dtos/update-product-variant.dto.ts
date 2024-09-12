import { Exclude } from 'class-transformer';
import { CreateProductVariantDTO } from './create-product-variant.dto';
import { PartialType } from '@nestjs/mapped-types';
export class UpdateProductVariantDTO extends PartialType(
  CreateProductVariantDTO,
) {
  // @Exclude()
  // color?: string;

  @Exclude()
  product?: string;
}
