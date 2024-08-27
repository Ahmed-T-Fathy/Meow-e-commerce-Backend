import { BadRequestException, Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, Req, Request, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersPaginationDTO } from './dtos/orders-pagination.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Order } from './order.entity';
import { UUIDDTO } from 'src/dto/UUID-dto';
import { UpdateOrderDTO } from './dtos/update-order.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { OrderDTO } from './dtos/order.dto';
import { AuthGaurd } from 'src/auth/guards/auth.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from 'src/users/roles.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateOrderDTO } from './dtos/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private orderService: OrdersService) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGaurd)
  @Post('')
  async createOrder(@Request() req,@Body() data:CreateOrderDTO) {
    return this.orderService.createOrder(req.user,data);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.Admin,Role.User)
  @UseGuards(AuthGaurd)
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
  @UseGuards(AuthGaurd)
  @Get('/:id')
  async getOrderById(@Param() paramObj:UUIDDTO){
    return await this.orderService.getOrderById(paramObj.id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
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
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  @UseGuards(AuthGaurd)
  @Delete('/:id')
  async deleteOrder(@Param() paramObj: UUIDDTO){
    return await this.orderService.deleteOrder(paramObj.id);
  }

}
