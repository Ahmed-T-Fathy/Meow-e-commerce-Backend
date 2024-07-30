import { Expose } from 'class-transformer';
import { Category } from 'src/categories/category.entity';

export class ProductDTO {
  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  after_discount_price: number;

  @Expose()
  categories:Category[];

  @Expose()
  created_at:Date;

  @Expose()
  updated_at:Date;

}
