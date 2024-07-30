import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDTO } from './dtos/create-product.dto';
import { Product } from './product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, In, Repository } from 'typeorm';
import { Category } from 'src/categories/category.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ProductsPaginationQueryDTO } from './dtos/products-paginiation-query.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Category) private categoryRepo: Repository<Category>,
  ) {}
  async createProduct(data: CreateProductDTO): Promise<Product> {
    try {
      if (!data.categories || data.categories.length === 0)
        throw new BadRequestException(
          'the product be asign to at least on category!',
        );

      const foundCategories = await this.categoryRepo.findBy({
        id: In(data.categories),
      });

      if (foundCategories.length !== data.categories.length) {
        throw new NotFoundException('there is categories not found!');
      }

      delete data.categories;
      const productData = data as DeepPartial<Product>;

      const product = await this.productRepo.create(productData);
      product.categories = foundCategories;

      return await this.productRepo.save(product);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async paginateProducts(
    options: IPaginationOptions,
    other: ProductsPaginationQueryDTO,
  ): Promise<Pagination<Product>> {
    const queryBuilder = this.productRepo.createQueryBuilder('p');
    if (other?.orderBy) {
      other.orderBy.forEach((orderBy) => {
        queryBuilder.addOrderBy(`p.${orderBy.field}`, orderBy.direction);
      });
    }
    if (other?.name) {
      queryBuilder.andWhere('p.name LIKE :name', { name: `%${other.name}%` });
    }

    if (other?.price) {
      queryBuilder.andWhere('p.price = :price', { price: +other.price });
    }

    if (other?.after_discount_price) {
      queryBuilder.andWhere('p.after_discount_price = :after_discount_price', {
        after_discount_price: +other.after_discount_price,
      });
    }
    return await paginate<Product>(queryBuilder, options);
  }

  async getProductById(id: string): Promise<Product> {
    return await this.productRepo.findOne({
      where: {
        id,
      },
    });
  }

  async deleteProduct(id: string) {
    const product = await this.checkExistance(id);
    this.productRepo.remove(product);
  }

  async updateProduct(id: string, updateDto: UpdateProductDTO) {
    try {
      await this.checkExistance(id);
      const data= updateDto as DeepPartial<Product>
      return await this.productRepo.update({ id }, data);
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
  
  private async checkExistance(id: string): Promise<Product> {
    const product = await this.getProductById(id);
    if (!product) throw new NotFoundException('product not found!');
    return product;
  }
}
