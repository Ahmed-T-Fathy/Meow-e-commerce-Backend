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
  UseGuards,
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
import { AuthGaurd } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
@Controller('categories')
export class CategoriesController {
  constructor(private categorySevice: CategoriesService) {}

  @Serialize(CategoryDTO)
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Post('')
  async createCategories(@Body() categoryDto: CreateCategoryDTO) {
    return await this.categorySevice.createCategory(categoryDto);
  }

  @UseGuards(AuthGaurd)
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
  @UseGuards(AuthGaurd)
  @Get('/:id')
  async getCategoryById(@Param() paramObj: CategoryIdDTO): Promise<Category> {
    return await this.categorySevice.getCategoryById(paramObj.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
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
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Delete('/:id')
  async deleteCategory(@Param() paramObj: CategoryIdDTO){
    return await this.categorySevice.deleteCategory(paramObj.id);
  }
}
