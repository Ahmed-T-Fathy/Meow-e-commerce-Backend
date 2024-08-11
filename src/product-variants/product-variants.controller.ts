import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ProductVariantsService } from './product-variants.service';
import { CreateProductVariantDTO } from './dtos/create-product-variant.dto';
import { ProductVariant } from './product-variant.entity';
import { query } from 'express';
import { VariantsPaginationDTO } from './dtos/variant-pagination.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { UUIDDTO } from 'src/dto/UUID-dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ProductVariantDTO } from './dtos/product-variant.dto';
import { UpdateProductVariantDTO } from './dtos/update-product-variant.dto';
import { log } from 'console';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(private productVariantsService: ProductVariantsService) {}
  @Post('')
  async createProductVariant(
    @Body() data: CreateProductVariantDTO,
  ): Promise<ProductVariant> {
    return await this.productVariantsService.createProductVariant(data);
  }
  @Get('')
  async getVariantsWithPagination(
    @Query() queryDto: VariantsPaginationDTO,
  ): Promise<Pagination<ProductVariant>> {
    const page = queryDto.page;
    const limit = queryDto.limit;

    return await this.productVariantsService.paginateVariant(
      {
        page,
        limit,
        route: 'product-variants/',
      },
      queryDto,
    );
  }

  @Serialize(ProductVariantDTO)
  @Get('/:id')
  async getVariantById(@Param() paramObj: UUIDDTO) {
    // log(await this.productVariantsService.getVariantById(
    //   paramObj.id,
    // ))
    return await this.productVariantsService.getVariantById(
      paramObj.id,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('/:id')
  async updateVariant(
    @Param() paramObj: UUIDDTO,
    @Body() updateObj: UpdateProductVariantDTO,
  ){
    if(Object.keys(updateObj).length === 0)
      throw new BadRequestException('there is no data to update!')
    return await this.productVariantsService.updateVariant(paramObj.id, updateObj);
  }
  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteVariant(@Param() paramObj: UUIDDTO){
    return await this.productVariantsService.deleteVariant(paramObj.id);
  }

}
