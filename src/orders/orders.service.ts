import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { CreateOrderDTO } from './dtos/create-order.dto';
import { Users } from 'src/users/users.entity';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { OrdersPaginationDTO } from './dtos/orders-pagination.dto';
import { UpdateOrderDTO } from './dtos/update-order.dto';
import { Orders_Status } from './order-status';
import { Basket } from 'src/basket/basket.entity';
import { OrderItem } from 'src/order-items/order-item.entity';
import { BasketItem } from 'src/basket-items/basket-item.entity';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(Basket) private basketRepo: Repository<Basket>,
    private datasource: DataSource,
  ) {}

  // https://chatgpt.com/c/a78c554c-b073-4752-8596-7612c6ac8aac
  async createOrder(user: Users,data:CreateOrderDTO) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //create new order instance
      const order = new Order();
      order.user = user;
      order.status = Orders_Status.outstanding;
      order.total_price=0;
      order.address=data.address;
      const savedOrder = await queryRunner.manager.save(order);

      //get user's basket with eager load his items
      const basket = await this.basketRepo.findOne({
        where: { user: { id: user.id } },
        relations: [
          'basket_items',
          'basket_items.product_variant',
          'basket_items.product_variant.product',
        ],
      });

      if (!basket) throw new NotFoundException('User have no basket!');

      if (basket.basket_items.length === 0)
        throw new NotFoundException('There is no items in the basket!');


      await Promise.all(basket.basket_items.map( async item=>{

        // create order items form the product item
        const order_item=new OrderItem();
        order_item.quantity=item.quantity;
        order_item.price=item.product_variant.product.after_discount_price?item.product_variant.product.after_discount_price:item.product_variant.product.price;
        order_item.product_variant=item.product_variant;
        order_item.order=savedOrder;

        await queryRunner.manager.save(order_item);
        const product_variant=item.product_variant;

        if(product_variant.stock<item.quantity)
          throw new ConflictException(`This in valid quantity while the product variant: ${product_variant}`);

        product_variant.stock -= item.quantity;

        await queryRunner.manager.save(product_variant);

        return order_item;
      }))
      
      await queryRunner.manager.delete(BasketItem,{basket});
      
      // Commit transaction
      await queryRunner.commitTransaction();


      return savedOrder;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
    // const queryBuilder = this.orderRepo.createQueryBuilder('o');
    // queryBuilder.where('o.user_id = :user_id', { user_id: data.user_id });
    // queryBuilder.andWhere("o.status = 'outstanding'");
    // const result: Order = await queryBuilder.getOne();
    // if (result) {
    //   throw new ConflictException('You have alread outstanding order');
    // }

    // const order = await this.orderRepo
    //   .createQueryBuilder()
    //   .insert()
    //   .into('order')
    //   .values({
    //     user: { id: data.user_id },
    //     total_price: 0,
    //     status: 'outstanding',
    //   })
    //   .execute();
    // return order.identifiers[0];
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
    let obj: DeepPartial<Order> = updateDto as DeepPartial<Order>;

    return await this.orderRepo.update({ id }, obj);
  }
}
