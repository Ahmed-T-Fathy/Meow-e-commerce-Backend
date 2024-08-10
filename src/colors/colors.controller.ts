import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDTO } from './dtos/create-color.dto';
import { Color } from './color.entity';
import { ColorsPaginationQueryDTO } from './dtos/color-pagination-query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ColorDTO } from './dtos/color.dto';
import { ColorIdDTO } from './dtos/Color-id.dto';
import { UpdateColorDTO } from './dtos/update-color.dto';
@Controller('colors')
export class ColorsController {
  constructor(private colorService: ColorsService) {}

  @Serialize(Color)
  @Post('')
  async createColor(@Body() data: CreateColorDTO): Promise<Color> {
    return await this.colorService.createColor(data);
  }

  @Get('')
  async getColorsWithPagination(
    @Query() queryDto: ColorsPaginationQueryDTO,
  ): Promise<Pagination<Color>> {
    const page = queryDto?.page;
    const limit = queryDto?.limit;

    return await this.colorService.paginateColors(
      {
        page,
        limit,
        route: 'colors/',
      },
      queryDto,
    );
  }

  @Serialize(ColorDTO)
  @Get('/:id')
  async getColorById(@Param() paramObj: ColorIdDTO): Promise<Color> {
    return await this.colorService.getColorById(paramObj.id);
  }
  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('/:id')
  async updateColor(
    @Param() paramObj: ColorIdDTO,
    @Body() updateObj: UpdateColorDTO,
  ){
    if(Object.keys(updateObj).length === 0)
      throw new BadRequestException('there is no data to update!')
    return await this.colorService.updateColor(paramObj.id, updateObj);
  }
  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteCategory(@Param() paramObj: ColorIdDTO){
    return await this.colorService.deleteColor(paramObj.id);
  }
}
