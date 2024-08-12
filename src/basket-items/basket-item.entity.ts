import { Basket } from 'src/basket/basket.entity';
import { ProductVariant } from 'src/product-variants/product-variant.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BeforeInsert, BeforeUpdate, JoinColumn } from 'typeorm';


@Entity()
export class BasketItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  quantity: number;

  @Column('decimal')
  price: number;

  @ManyToOne(()=>ProductVariant,(productVariant) => productVariant.basket_items, { nullable: false,onDelete:'CASCADE' })
  @JoinColumn({ name: 'product_variant_id' })
  product_variant:ProductVariant;

  @ManyToOne(()=>Basket,(basket)=>basket.basket_items, { nullable: false,onDelete:'CASCADE' })
  @JoinColumn({ name: 'basket_id' })
  basket:Basket;

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
