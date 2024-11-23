import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OrderItem } from 'src/order-items/order-item.entity';
import { Order } from 'src/orders/order.entity';
import { ProductVariant } from 'src/product-variants/product-variant.entity';
import { Product } from 'src/products/product.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AnalyticsService {
  constructor(private readonly dataSource: DataSource) {}
  async getSalesAnlytics() {
    try {
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
}
