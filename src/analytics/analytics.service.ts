import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Coupon } from 'src/coupons/coupon.entity';
import { OrderItem } from 'src/order-items/order-item.entity';
import { Orders_Status } from 'src/orders/order-status';
import { Order } from 'src/orders/order.entity';
import { ProductVariant } from 'src/product-variants/product-variant.entity';
import { Product } from 'src/products/product.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}
  async getProductAnalytics() {
    try {
      //add where the order is completed
      const result = await this.dataSource
        .createQueryBuilder()
        .select('product.id', 'product id')
        .addSelect('product.name', 'product name')
        .addSelect('sum(order_item.quantity*order_item.price)', 'total revenue')
        .addSelect('sum(product_variant.stock)', 'stock')
        .from(Product, 'product')
        .leftJoin(
          ProductVariant,
          'product_variant',
          'product_variant.product_id=product.id',
        )
        .leftJoin(
          OrderItem,
          'order_item',
          'order_item.product_variant_id=product_variant.id',
        )
        .groupBy('product.id')
        .addGroupBy('product.name')
        .getRawMany();

      return result;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }

  async getVariationAnalytics() {
    try {
      const result = await this.dataSource
        .createQueryBuilder()
        .select('product.name', 'product name')
        .addSelect('product.id', 'product id')
        .addSelect('sum(product_variant.stock)', 'not sold')
        .addSelect('sum(order_item.quantity)', 'sold')
        .addSelect(
          'SUM(product_variant.stock) + SUM(order_item.quantity)',
          'total',
        )
        .from(Product, 'product')
        .leftJoin(
          ProductVariant,
          'product_variant',
          'product_variant.product_id=product.id',
        )
        .leftJoin(
          OrderItem,
          'order_item',
          'order_item.product_variant_id=product_variant.id',
        )
        .leftJoin(Order, 'order', 'order_item.order_id=order.id')
        .where('order.status = :status', { status: 'Completed' })
        .groupBy('product.id')
        .getRawMany();
      return result;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
  async getRevenueAnalytics() {
    try {
      const returns = await this.dataSource
        .createQueryBuilder()
        .select('sum(order.total_price)', 'Revenue')
        .from(Order, 'order')
        .where('order.status=:status', {
          status: Orders_Status.refunded,
        })
        .groupBy('order.id')
        .getRawOne();

      const coupons = await this.dataSource
        .createQueryBuilder()
        .select('COUNT(coupon.id)', 'coupon_count')
        .from(Coupon, 'coupon')
        .getRawOne();

      const sales = await this.dataSource
        .createQueryBuilder()
        .select('sum(order.total_price)', 'total sales')
        .from(Order, 'order')
        .where('order.status=:status', {
          status: Orders_Status.completed,
        })
        .groupBy('order.id')
        .getRawOne();

      const taxs = await this.dataSource
        .createQueryBuilder()
        .select('sum(order.tax) + sum(order.delivery_service)', 'taxs')
        .from(Order, 'order')
        .where('order.status=:status', {
          status: Orders_Status.completed,
        })
        .groupBy('order.id')
        .getRawOne();

      const result = {};
      Object.assign(result, returns);
      Object.assign(result, coupons);
      Object.assign(result, sales);
      Object.assign(result, taxs);

      return result;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
}
