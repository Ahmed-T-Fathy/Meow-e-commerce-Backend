import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateProductDTO } from './dtos/create-product.dto';
import { ProductsService } from './products.service';
import { ProductDTO } from './dtos/product.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ProductsPaginationQueryDTO } from './dtos/products-paginiation-query.dto';
import { Product } from './product.entity';
import { Pagination } from 'nestjs-typeorm-paginate';
import { ProductIdDTO } from './dtos/product-id.dto';
import { UpdateProductDTO } from './dtos/update-product.dto';
import { AddCategoriesDTO } from './dtos/add-categories.dto';
import { AuthGaurd } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}
  
  @Serialize(ProductDTO)
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Post('')
  async createProduct(@Body() data: CreateProductDTO) {
    return this.productService.createProduct(data);
  }

  // @UseGuards(AuthGaurd)
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

  @Serialize(ProductDTO)
  @UseGuards(AuthGaurd)
  @Get('/:id')
  async getProduct(@Param() paramObj: ProductIdDTO){
    return await this.productService.getProductById(paramObj.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Patch('/:id')
  async updateCategory(
    @Param() paramObj: ProductIdDTO,
    @Body() updateObj: UpdateProductDTO,
  ){
    if(Object.keys(updateObj).length === 0)
      throw new BadRequestException('there is no data to update!')
    return await this.productService.updateProduct(paramObj.id, updateObj);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Delete('/:id')
  async deleteCategory(@Param() paramObj: ProductIdDTO){
    return await this.productService.deleteProduct(paramObj.id);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Post(':id/add-categories')
  async addCategoriesToProduct(
    @Param('id') productId: string,
    @Body() addCategoriesDto: AddCategoriesDTO,
  ) {
    try {
      const updatedProduct = await this.productService.addCategoriesToProduct(
        productId,
        addCategoriesDto.categoryIds,
      );
      return updatedProduct;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Product or some categories not found!');
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Delete(':id/remove-categories')
  async removeCategoriesFromProduct(
    @Param('id') productId: string,
    @Body() removeCategoriesDto: AddCategoriesDTO,
  ) {
    try {
      const updatedProduct = await this.productService.removeCategoriesFromProduct(
        productId,
        removeCategoriesDto.categoryIds,
      );
      return updatedProduct;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('Product or categories not found!');
      }
      if (error instanceof BadRequestException) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }

}
