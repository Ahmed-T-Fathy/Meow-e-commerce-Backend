import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { Users } from 'src/users/users.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { OrdersPaginationDTO } from './dtos/orders-pagination.dto';
import { UpdateOrderDTO } from './dtos/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
  ) {}

  async createOrder(data: CreateOrderDTO) {
    const queryBuilder = this.orderRepo.createQueryBuilder('o');
    queryBuilder.where('o.user_id = :user_id', { user_id: data.user_id });
    queryBuilder.andWhere("o.status = 'outstanding'");
    const result: Order = await queryBuilder.getOne();
    if (result) {
      throw new ConflictException('You have alread outstanding order');
    }

    const order = await this.orderRepo
      .createQueryBuilder()
      .insert()
      .into('order')
      .values({
        user: { id: data.user_id },
        total_price: 0,
        status: 'outstanding',
      })
      .execute();
    return order.identifiers[0];
  }

  async pagenateOrders(
    options: IPaginationOptions,
    other: OrdersPaginationDTO,
  ): Promise<Pagination<Order>> {
    const queryBuilder = this.orderRepo.createQueryBuilder('o');
    if (other?.orderBy) {
      other.orderBy.forEach((orderBy) => {
        queryBuilder.addOrderBy(`o.${orderBy.field}`, orderBy.direction);
      });
    }

    if (other.status) {
      queryBuilder.andWhere('o.status =:status', { status: other.status });
    }
    if (other.user) {
      queryBuilder.andWhere('o.user_id =:user_id', { user_id: other.user });
    }

    return await paginate<Order>(queryBuilder, options);
  }

  async deleteOrder(id: string) {
    const order = await this.getOrderById(id);
    await this.orderRepo.remove(order);
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!order) {
      throw new NotFoundException('Order variant not found!');
    }
    return order;
  }

  async updateOrder(id: string, updateDto: UpdateOrderDTO) {
    const order = await this.getOrderById(id);
    let obj: DeepPartial<Order> =
      updateDto as DeepPartial<Order>;

    return await this.orderRepo.update({ id }, obj);
  }
}
