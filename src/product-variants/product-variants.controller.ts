import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
import { AuthGaurd } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/users/roles.enum';

@Controller('product-variants')
export class ProductVariantsController {
  constructor(private productVariantsService: ProductVariantsService) {}

  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Post('')
  async createProductVariant(
    @Body() data: CreateProductVariantDTO,
  ): Promise<ProductVariant> {
    return await this.productVariantsService.createProductVariant(data);
  }

  @UseGuards(AuthGaurd)
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
  @UseGuards(AuthGaurd)
  @Get('/:id')
  async getVariantById(@Param() paramObj: UUIDDTO) {
    return await this.productVariantsService.getVariantById(
      paramObj.id,
    );
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
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
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Delete('/:id')
  async deleteVariant(@Param() paramObj: UUIDDTO){
    return await this.productVariantsService.deleteVariant(paramObj.id);
  }

}
