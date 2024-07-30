import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CreateProductDTO } from './dtos/create-product.dto';
import { ProductsService } from './products.service';
import { ProductDTO } from './dtos/product.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ProductsPaginationQueryDTO } from './dtos/products-paginiation-query.dto';
import { Product } from './product.entity';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}
  
  @Serialize(ProductDTO)
  @Post('')
  async createProduct(@Body() data: CreateProductDTO) {
    return this.productService.createProduct(data);
  }

  @Get('')
  async getProductsWithPagination(
    @Query() queryDto:ProductsPaginationQueryDTO,
  ):Promise<Pagination<Product>>{
    const page = queryDto?.page?queryDto.page:1;
    const limit = queryDto?.limit?queryDto.limit:10;
    return await this.productService.paginateProducts({
        page,
        limit,
        route: 'products/',
    },queryDto);
  }
}
