import {
  BadRequestException,
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
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
import { CategoryIdDTO } from './dtos/category-id.dto';
import { UpdateCategoryDTO } from './dtos/update-category.dto';
@Controller('categories')
export class CategoriesController {
  constructor(private categorySevice: CategoriesService) {}

  @Serialize(CategoryDTO)
  @Post('')
  async createCategories(@Body() categoryDto: CreateCategoryDTO) {
    return await this.categorySevice.createCategory(categoryDto);
  }

  @Get('')
  async getCategoriesWithPagination(
    @Query() queryDto: CategoriesPaginationQueryDTO,
  ): Promise<Pagination<Category>> {
    const page = queryDto?.page;
    const limit = queryDto?.limit;
    return await this.categorySevice.paginateCategories(
      {
        page,
        limit,
        route: 'categories/',
      },
      queryDto,
    );
  }

  @Serialize(CategoryDTO)
  @Get('/:id')
  async getCategoryById(@Param() paramObj: CategoryIdDTO): Promise<Category> {
    return await this.categorySevice.getCategoryById(paramObj.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('/:id')
  async updateCategory(
    @Param() paramObj: CategoryIdDTO,
    @Body() updateObj: UpdateCategoryDTO,
  ){
    if(Object.keys(updateObj).length === 0)
      throw new BadRequestException('there is no data to update!')
    return await this.categorySevice.updateCategory(paramObj.id, updateObj);
  }
  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteCategory(@Param() paramObj: CategoryIdDTO){
    return await this.categorySevice.deleteCategory(paramObj.id);
  }
}
