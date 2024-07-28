import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CreateCategoryDTO } from './dtos/createCategory.dto';
import { CategoriesService } from './categories.service';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CategoryDTO } from './dtos/category.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Category } from './category.entity';
import { CategoriesPaginationQueryDTO } from './dtos/categories-pagination-query.dto';
@Controller('categories')
export class CategoriesController {
  constructor(private categorySevice: CategoriesService) {}

  @Serialize(CategoryDTO)
  @Post('/create')
  createCategories(@Body() categoryDto: CreateCategoryDTO) {
    return this.categorySevice.createCategory(categoryDto);
  }

  @Get('/getall')
  getCategoriesWithPagination(
    @Query() queryDto:CategoriesPaginationQueryDTO
  ): Promise<Pagination<Category>> {
    const page=queryDto?.page;
    const limit=queryDto?.limit;
    return this.categorySevice.paginateCategories({
        page,
        limit,
      route: 'categories/getall',
    },queryDto);
  }
}
