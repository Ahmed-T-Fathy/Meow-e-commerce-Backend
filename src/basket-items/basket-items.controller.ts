import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { BasketItemsService } from './basket-items.service';
import { AddItemIntoBasketDTO } from './dtos/add-item-to-basket.dto';
import { BasketItemsPaginationQueryDTO } from './dtos/basket-items-pagination.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { BasketItem } from './basket-item.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UUIDDTO } from 'src/dto/UUID-dto';
import { UpdateBasketItemDTO } from './dtos/update-basket-item.dto';
import { BasketItemDTO } from './dtos/basket-item.dto';

@Controller('basket-items')
export class BasketItemsController {
  constructor(private basketItemsService: BasketItemsService) {}

  @Post()
  async addItemIntoBasket(@Body() data: AddItemIntoBasketDTO) {
    return await this.basketItemsService.AddItemToBasket(data);
  }

  @Get()
  async paginatebasketItems(
    @Query() queryDto: BasketItemsPaginationQueryDTO,
  ): Promise<Pagination<BasketItem>> {
    const page = queryDto?.page;
    const limit = queryDto?.limit;

    return await this.basketItemsService.paginateItems(
      {
        page,
        limit,
        route: 'basket-items/',
      },
      queryDto,
    );
  }

  @Serialize(BasketItemDTO)
  @Get('/:id')
  async getItemById(@Param() paramObj: UUIDDTO): Promise<BasketItem> {
    console.log(await this.basketItemsService.getBasketItemById(paramObj.id));
    
    return await this.basketItemsService.getBasketItemById(paramObj.id);
  }
  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('/:id')
  async updatItem(
    @Param() paramObj: UUIDDTO,
    @Body() updateObj: UpdateBasketItemDTO,
  ){
    if(Object.keys(updateObj).length === 0)
      throw new BadRequestException('there is no data to update!')
    return await this.basketItemsService.UpdateBasketItemQuntity(paramObj.id, updateObj);
  }
  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteItem(@Param() paramObj: UUIDDTO){
    return await this.basketItemsService.deleteBasketItem(paramObj.id);
  }
}
