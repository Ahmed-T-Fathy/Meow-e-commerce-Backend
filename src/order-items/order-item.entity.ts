import { Order } from 'src/orders/order.entity';
import { ProductVariant } from 'src/product-variants/product-variant.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('int')
  quantity: number;

  @Column('decimal')
  price: number;

  @ManyToOne(()=>ProductVariant,(productVariant) => productVariant.order_items, {onDelete:'SET NULL' })
  @JoinColumn({ name: 'product_variant_id' })
  product_variant:ProductVariant;

  @ManyToOne(()=>Order,(order)=>order.order_items, { nullable: false,onDelete:'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order:Order;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @BeforeInsert()
  beforeInsert() {
    this.created_at = new Date();
  }

  @BeforeUpdate()
  beforeUpdate() {
    this.updated_at = new Date();
  }
}
