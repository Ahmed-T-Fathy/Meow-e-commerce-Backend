import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersPaginationDTO } from './dtos/orders-pagination.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Order } from './order.entity';
import { UUIDDTO } from 'src/dto/UUID-dto';
import { UpdateOrderDTO } from './dtos/update-order.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { OrderDTO } from './dtos/order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @Post('')
  async createOrder() {
    return this.orderService.createOrder({
      user_id: 'd57a5b79-a351-46e4-9742-22e3ed006edf',
    });
  }

  @Get('')
  async getOrdersWithPagination(
    @Query() queryDto: OrdersPaginationDTO,
  ): Promise<Pagination<Order>> {
    const page = queryDto.page;
    const limit = queryDto.limit;

    return await this.orderService.pagenateOrders(
      {
        page,
        limit,
        route: 'orders/',
      },
      queryDto,
    );
  }

  @Serialize(OrderDTO)
  @Get('/:id')
  async getOrderById(@Param() paramObj:UUIDDTO){
    return await this.orderService.getOrderById(paramObj.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch('/:id')
  async updateOrder(
    @Param() paramObj: UUIDDTO,
    @Body() updateObj: UpdateOrderDTO,
  ){
    if(Object.keys(updateObj).length === 0)
      throw new BadRequestException('there is no data to update!')
    return await this.orderService.updateOrder(paramObj.id, updateObj);
  }
  
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  async deleteOrder(@Param() paramObj: UUIDDTO){
    return await this.orderService.deleteOrder(paramObj.id);
  }

}
