import { Color } from 'src/colors/color.entity';
import { OrderItem } from 'src/order-items/order-item.entity';
import { Product } from 'src/products/product.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity()
export class ProductVariant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  size: string;

  @Column('int')
  stock: number;

  @ManyToOne(()=>Product,(product)=>product.product_variant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(()=>Color,(color)=>color.product_variant, { onDelete: 'SET NULL' })
  @JoinColumn({name:"color_id"})
  color:Color;

  @OneToMany(()=>ProductVariant,(productVariant) => productVariant.order_items)
  order_items:OrderItem[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
