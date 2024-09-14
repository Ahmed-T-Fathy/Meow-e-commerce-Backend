import { Expose, Type } from 'class-transformer';
import { Category } from 'src/categories/category.entity';
import { CategoryDTO } from 'src/categories/dtos/category.dto';

export class ProductDTO {
  @Expose()
  id: string;
  
  @Expose()
  name: string;

  @Expose()
  short_description:string;
  
  @Expose()
  description: string;
  
  @Expose()
  price: number;

  @Expose()
  after_discount_price: number;

  @Expose()
  @Type(() => CategoryDTO)
  categories: CategoryDTO[];

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
