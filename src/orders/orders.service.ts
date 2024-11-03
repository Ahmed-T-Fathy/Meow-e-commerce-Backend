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
import { Coupon } from 'src/coupons/coupon.entity';
import { CouponsService } from 'src/coupons/coupons.service';
import { TaxsService } from 'src/taxs/taxs.service';
import { CheckInvoiceDTO } from './dtos/check-invoice.dto';
import { MailService } from 'src/mail/mail.service';
import { PaymentFactory } from 'src/payment/payment.factory';
import { PaymentMethod } from 'src/payment/payment-methods.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Basket) private basketRepo: Repository<Basket>,
    private readonly couponsService: CouponsService,
    private readonly taxsService: TaxsService,
    private readonly mailService: MailService,
    private datasource: DataSource,
    private readonly paymentFactory: PaymentFactory,
  ) {}
  async placeOrder(user: Users, data: CreateOrderDTO) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
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

      // Get total price
      let total_price = await basket.basket_items.reduce(
        async (accumulatorPromise, basket_item) => {
          let accumulator = await accumulatorPromise;

          let price =
            basket_item.product_variant.product.after_discount_price &&
            basket_item.product_variant.product.after_discount_price != 0
              ? basket_item.product_variant.product.after_discount_price
              : basket_item.product_variant.product.price;

          price = await Promise.resolve(price);

          return accumulator + price * basket_item.quantity;
        },
        Promise.resolve(0),
      );
      // get tax
      const tax = await this.taxsService.getTaxByTitle('TAX');
      const deliveryService =
        await this.taxsService.getTaxByTitle('Delivery service');
      total_price =
        Number(total_price) + Number(tax.value) + Number(deliveryService.value);

      let coupon: Coupon;
      let before_discount: number = parseFloat(total_price.toFixed(2));
      if (data.coupon) {
        coupon = await this.couponsService.getCouponByName(data.coupon);
      }
      if (coupon)
        total_price = parseFloat(coupon.getDiscount(total_price).toFixed(2));

      coupon.usageNo = coupon.usageNo + 1;
      await queryRunner.manager.save(coupon);

      //create new order instance
      let order = new Order();
      Object.assign(order, data);

      //get order number
      let lastestOrder = await this.orderRepo.find({
        order: { orderNo: 'DESC' },
      });

      if (lastestOrder.length > 0 && lastestOrder[0]?.orderNo) {
        order.orderNo = lastestOrder[0].orderNo + 1;
      } else {
        order.orderNo = 10000;
      }

      order.user = user;
      order.status = Orders_Status.outstanding;
      order.total_price = total_price;
      order.beforeDiscount = before_discount;
      order.discount = parseFloat((before_discount - total_price).toFixed(2));
      order.tax = tax.value;
      order.deliveryService = deliveryService.value;

      const savedOrder = await queryRunner.manager.save(order);
      // throw new InternalServerErrorException("err");

      await Promise.all(
        basket.basket_items.map(async (item) => {
          // create order items form the product item
          const order_item = new OrderItem();
          order_item.quantity = item.quantity;
          order_item.price =
            item.product_variant.product.after_discount_price &&
            item.product_variant.product.after_discount_price != 0
              ? item.product_variant.product.after_discount_price
              : item.product_variant.product.price;
          order_item.product_variant = item.product_variant;
          order_item.order = savedOrder;

          await queryRunner.manager.save(order_item);
          const product_variant = item.product_variant;

          if (product_variant.stock < item.quantity)
            throw new ConflictException(
              `This in valid quantity while the product variant: ${product_variant}`,
            );

          product_variant.stock -= item.quantity;

          await queryRunner.manager.save(product_variant);

          return order_item;
        }),
      );

      const paymentStratgy = this.paymentFactory.getPaymentMethod(
        PaymentMethod.stripe,
      );
      await paymentStratgy.processPayment(total_price, order.id);
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException('err');

      await queryRunner.manager.delete(BasketItem, { basket });

      await queryRunner.commitTransaction();
      return savedOrder;
    } catch (err) {
    } finally {
      await queryRunner.release();
    }
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
      relations: ['user', 'order_items'],
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

  async getinvoice(user: Users, data?: CheckInvoiceDTO) {
    const queryRunner = this.datasource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
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

      // Get total price
      let total_price = await basket.basket_items.reduce(
        async (accumulatorPromise, basket_item) => {
          let accumulator = await accumulatorPromise;

          let price =
            basket_item.product_variant.product.after_discount_price &&
            basket_item.product_variant.product.after_discount_price != 0
              ? basket_item.product_variant.product.after_discount_price
              : basket_item.product_variant.product.price;

          price = await Promise.resolve(price);

          return accumulator + price * basket_item.quantity;
        },
        Promise.resolve(0),
      );

      // get tax
      const tax = await this.taxsService.getTaxByTitle('TAX');
      const deliveryService =
        await this.taxsService.getTaxByTitle('Delivery service');
      total_price =
        Number(total_price) + Number(tax.value) + Number(deliveryService.value);

      total_price = parseFloat(total_price.toFixed(2));
      let coupon: Coupon;
      let before_discount: number = total_price;
      if (data.coupon) {
        coupon = await this.couponsService.getCouponByName(data.coupon);
      }

      if (coupon) {
        total_price = parseFloat(coupon.getDiscount(total_price).toFixed(2));
        coupon.usageNo = coupon.usageNo + 1;
      }

      //create new order instance
      let order = new Order();
      Object.assign(order, data);
      order.user = user;
      order.status = Orders_Status.outstanding;
      order.total_price = total_price;
      order.beforeDiscount = before_discount;
      order.discount = Math.abs(
        parseFloat((before_discount - total_price).toFixed(2)),
      );
      order.tax = tax.value;
      order.deliveryService = deliveryService.value;

      let orderItems = await Promise.all(
        basket.basket_items.map(async (item) => {
          // create order items form the product item
          const order_item = new OrderItem();
          order_item.quantity = item.quantity;
          order_item.price =
            item.product_variant.product.after_discount_price &&
            item.product_variant.product.after_discount_price != 0
              ? item.product_variant.product.after_discount_price
              : item.product_variant.product.price;
          order_item.product_variant = item.product_variant;
          // order_item.order = order;

          const product_variant = item.product_variant;

          if (product_variant.stock < item.quantity)
            throw new ConflictException(
              `This in valid quantity while the product variant: ${product_variant}`,
            );

          return order_item;
        }),
      );
      order.order_items = orderItems;
      // console.log(order);

      await this.mailService.sendMail(order as Invoice);
      return order;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      await queryRunner.release();
    }
  }
}
