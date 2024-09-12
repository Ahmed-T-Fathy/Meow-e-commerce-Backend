import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from './product-variant.entity';
import { DeepPartial, In, Repository } from 'typeorm';
import { Product } from 'src/products/product.entity';
// import { Color } from 'src/colors/color.entity';
import { CreateProductVariantDTO } from './dtos/create-product-variant.dto';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { VariantsPaginationDTO } from './dtos/variant-pagination.dto';
import { UpdateProductVariantDTO } from './dtos/update-product-variant.dto';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepo: Repository<ProductVariant>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    // @InjectRepository(Color) private colorRepo: Repository<Color>,
  ) {}

  async createProductVariant(
    data: CreateProductVariantDTO,
  ): Promise<ProductVariant> {
    // Find the product by ID
  const product = await this.productRepo.findOne({
    where: { id: data.product },
  });
  if (!product) throw new NotFoundException('Product not found!');

  // // Find the color by ID
  // const color = await this.colorRepo.findOne({ where: { id: data.color } });
  // if (!color) throw new NotFoundException('Color not found!');

  // Check if a variant with the same size and color already exists for the product
  const existingVariant = await this.productVariantRepo.findOne({
    where: {
      product: { id: data.product },
      // color: { id: data.color },
      size: data.size,
    },
  });
  if (existingVariant) {
    throw new ConflictException('Product variant with this size and color already exists!');
  }

  // If no duplicate found, create the variant
  let variant = data as DeepPartial<ProductVariant>;
  // variant.color = color;
  variant.product = product;
  
  return await this.productVariantRepo.save(variant);
  }

  async paginateVariant(
    options: IPaginationOptions,
    other: VariantsPaginationDTO,
  ): Promise<Pagination<ProductVariant>> {
    const queryBuilder = this.productVariantRepo.createQueryBuilder('v');
    if (other?.orderBy) {
      other.orderBy.forEach((orderBy) => {
        queryBuilder.addOrderBy(`v.${orderBy.field}`, orderBy.direction);
      });
    }

    // if (other?.color) {
    //   const color = await this.colorRepo.findOneBy({ id: other.color });
    //   if (!color) throw new NotFoundException('Color not found!');
    //   queryBuilder.andWhere('v.color_id = :color', { color: other.color });
    // }
    if (other?.product) {
      const product = await this.productRepo.findOneBy({ id: other.product });
      if (!product) throw new NotFoundException('Product not found!');
      queryBuilder.andWhere('v.product_id = :product', {
        product: other.product,
      });
    }

    if (other?.size) {
      queryBuilder.andWhere('v.size = :size', {
        size: other.size,
      });
    }

    return await paginate<ProductVariant>(queryBuilder, options);
  }

  async deleteVariant(id: string) {
    const variant = await this.getVariantById(id);
    await this.productVariantRepo.remove(variant);
  }

  async getVariantById(id: string): Promise<ProductVariant> {
    const variant = await this.productVariantRepo.findOne({
      where: { id },
      relations: [ 'product'],
    });
    // const variant = await this.productVariantRepo.findOne({
    //   where: { id },
    //   relations: ['color', 'product'],
    // });
    if (!variant) {
      throw new NotFoundException('Product variant not found!');
    }
    return variant;
  }

  async updateVariant(id: string, updateDto: UpdateProductVariantDTO) {
    const variant = await this.getVariantById(id);
    let obj: DeepPartial<ProductVariant> =
      updateDto as DeepPartial<ProductVariant>;
    // if (updateDto.color) {
    //   const color = await this.colorRepo.findOne({
    //     where: { id: updateDto.color },
    //   });
    //   if (!color) throw new NotFoundException('Color Not found!');
    //   obj.color;
    // }

    if (updateDto.product) {
      const product = await this.productRepo.findOne({
        where: { id: updateDto.product },
      });
      if (!product) throw new NotFoundException('Product Not found!');
      obj.product;
    }

    return await this.productVariantRepo.update({ id }, obj);
  }
}
