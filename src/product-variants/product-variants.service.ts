import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductVariant } from './product-variant.entity';
import { DeepPartial, In, Repository } from 'typeorm';
import { Product } from 'src/products/product.entity';
import { Color } from 'src/colors/color.entity';
import { CreateProductVariantDTO } from './dtos/create-product-variant.dto';

@Injectable()
export class ProductVariantsService {
  constructor(
    @InjectRepository(ProductVariant)
    private productVariantRepo: Repository<ProductVariant>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Color) private colorRepo: Repository<Color>,
  ) {}

  async createProductVariant(data: CreateProductVariantDTO) :Promise<ProductVariant>{
    const product = await this.productRepo.findOne({
      where: { id: data.product },
    });
    if (!product) throw new NotFoundException('Product not found!');
    const color = await this.colorRepo.findOne({ where: { id: data.color } });
    if (!color) throw new NotFoundException('Color Not found!');
    let variant= data as DeepPartial<ProductVariant>;
    variant.color=color;
    variant.product=product;
    return await this.productVariantRepo.save(variant);
  }
}
